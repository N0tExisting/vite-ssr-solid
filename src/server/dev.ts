import createServer from '.';

export const viteNodeApp = createServer()
	.then(({ app }) => app)
	.catch((err) => {
		console.error(err);
		return err;
	});
