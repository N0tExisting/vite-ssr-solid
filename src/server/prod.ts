import app from './index';

const PORT = process.env['PORT'] || (import.meta.env.PORT as string) || '3000';

if (require.main && require.main.filename === module.filename) {
	app.listen(PORT, () => {
		console.log(`http://localhost:${PORT}`);
	});
}

export * from './index';
