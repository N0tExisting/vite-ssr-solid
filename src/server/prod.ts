import createServer from '.';

const isTest =
	process.env['NODE_ENV'] === 'test' || !!process.env['VITE_TEST_BUILD'];
const PORT = process.env['PORT'] || '3000';

if (!isTest) {
	createServer()
		.then(({ app }) =>
			app.listen(PORT, () => {
				console.log(`http://localhost:${PORT}`);
			}),
		)
		.catch((err) => {
			console.error('Error Starting Server:\n', err);
			process.exit(1);
		});
}
