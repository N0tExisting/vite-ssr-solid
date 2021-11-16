// file deepcode ignore Utf8Literal: Web uses utf-8
import { readFileSync, existsSync } from 'fs';
import * as path from 'path';
import express from 'express';
import assert from 'assert';
import { render } from './renderer';
import indexHtml from '../../index.html?raw';
import { createServer as createViteServer } from 'vite';
import compression from 'compression';
import serveStatic from 'serve-static';
//import users from '../../static/users.json';
import users from './users';

const isTest =
	process.env['NODE_ENV'] === 'test' || !!process.env['VITE_TEST_BUILD'];

export default async function createServer(
	root = process.cwd(),
	isProd = process.env['NODE_ENV'] === 'production',
) {
	const resolve = (p: string) => path.resolve(__dirname, p);

	const app = express().disable('x-powered-by');

	const vite = await createViteServer({
		root,
		logLevel: isTest ? 'error' : 'info',
		server: {
			middlewareMode: true,
		},
	});

	if (!isProd) {
		// use vite's connect instance as middleware
		app.use(vite.middlewares);
	} else {
		app.use(compression());
		app.use(
			// TODO: Try using WWW_ROOT First
			serveStatic(resolve('../client'), {
				index: false,
				extensions: false,
			}),
		);
	}

	app.all('/api/v1/users/:uid', (req, res) => {
		let sent = false;
		Object.keys(users).some((uid) => {
			const isUser = uid === req.params.uid;
			if (!sent) {
				const user = users[uid];
				if (user) {
					res.json({ data: user });
					sent = isUser;
				}
			}
			return sent;
		});
		if (!sent) {
			res.status(404).json({ error: { status: 404 } });
		}
	});
	app.get('/api/v1/users', (req, res) => {
		res.json({ data: users });
	});

	app.get('/favicon.ico', (_, r) => r.redirect('/favicon.svg'));

	// deepcode ignore NoRateLimitingForExpensiveWebOperation: only used in dev
	app.use('*', async (req, res) => {
		try {
			const url = req.originalUrl;

			const template = isProd
				? indexHtml
				: await vite.transformIndexHtml(url, indexHtml);

			//console.log('Renderer:\n', render)
			assert(typeof render === 'function', '"render" is not a function!');

			const result = render(url);

			console.log(`Request '${req.originalUrl}' out:\n`, result.ctx);
			assert(
				result.ctx.matches,
				"'ctx.matches' doesn't exist,\nsomething probably went wrong!\nDid you try restarting nodemon?",
			);

			// TODO: 404 if ctx matches wrong

			if (result.ctx.url) {
				res.redirect(307, result.ctx.url);
			} else {
				const appHtml = template // TODO: Improve insert (don't rely on comments)
					.replace(`<!--app-head-->`, result.head + result.hydration)
					.replace(`<!--app-html-->`, result.body);

				// deepcode ignore XSS: url only used to render page, deepcode ignore ServerLeak: Doesn't happen here
				res
					.status(200)
					.set({ 'Content-Type': 'text/html;charset=utf-8' })
					.end(appHtml);
			}
		} catch (e: any) {
			res.status(500);
			vite.ssrFixStacktrace(e);
			console.log(e.stack);
			// Don't leak data in prod
			if (!isProd) {
				// deepcode ignore XSS: url only used in dev, deepcode ignore ServerLeak: not done in prod
				res.end(e.stack);
			}
		}
	});

	return { app, vite };
}
