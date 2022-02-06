// @ts-check
const createDevServer = require('vite').createServer;
const express = require('express');

const main = async () => {
	const vite = await createDevServer({});

	const PORT = vite.config.server.port || process.env.PORT || 3000;

	(await vite.ssrLoadModule('~vite')).setVite(vite);

	const rootServer = express().disable('x-powered-by');
	rootServer.use(
		async (req, res, next) =>
			// deepcode ignore PromiseNotCaughtNode: It's the users responsibility to catch errors
			await vite
				.ssrLoadModule('src/server/index.ts')
				.then((server) => server.default(req, res, next)),
	);
	rootServer.listen(PORT, () => {
		console.log(`Server listening on 'http://localhost:${PORT}'`);
	});
};

module.exports = main;

if (require.main === module) {
	main();
}
