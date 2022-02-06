// file deepcode ignore Utf8Literal: Web uses utf-8
/// <reference path="../typings/global.d.ts" />
import * as path from 'node:path';
import assert from 'node:assert';
import express from 'express';
import compression from 'compression';
import serveStatic from 'serve-static';
import { vite } from '~vite';
import { render } from './renderer';
import indexHtml from '../../index.html?raw';
import users from './users';
//import users from '../../static/users.json';

const resolve = (p: string) => path.resolve(__dirname, p);

const app = express().disable('x-powered-by');

const dev = import.meta.env.DEV ? vite! : undefined;

if (import.meta.env.DEV) {
	// use vite's connect instance as middleware
	app.use(dev!.middlewares);
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

		const template = import.meta.env.PROD
			? indexHtml
			: await dev!.transformIndexHtml(url, indexHtml).catch((e) => {
					console.error('Error transforming index.html', e);
					return indexHtml;
			  });

		//console.log('Renderer:\n', render)
		assert(typeof render === 'function', '"render" is not a function!');

		// deepcode ignore OR: User Needs to take care of this
		const result = render(url);

		// deepcode ignore FormatString: Important Debug Info
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
	} catch (e) {
		res.status(500);
		if (e instanceof Error) {
			dev?.ssrFixStacktrace(e);
		}
		console.log('Error during SSR:', e);
		// Don't leak data in prod
		if (import.meta.env.DEV) {
			// deepcode ignore XSS: url only used in dev, deepcode ignore ServerLeak: not done in prod
			res.end(e);
		}
	}
});

export default app;
