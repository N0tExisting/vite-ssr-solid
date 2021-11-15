import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
	plugins: [
		{
			...typescriptPaths(),
			enforce: 'pre',
			//! TODO: Fix Typescript Paths!
		},
		...VitePluginNode({
			// Nodejs native Request adapter
			// currently this plugin support 'express', 'nest', 'koa' and 'fastify' out of box,
			// you can also pass a function if you are using other frameworks, see Custom Adapter section
			adapter: 'express',

			// tell the plugin where is your project entry
			appPath: './src/server/dev.ts',

			// Optional, default: 'viteNodeApp'
			// the name of named export of you app from the appPath file
			exportName: 'viteNodeApp',
		}),
		solid({ ssr: true }),
	],
	build: {
		manifest: true,
		ssrManifest: true,
	},
	resolve: {
		preserveSymlinks: true, // Avoid errors with pnpm linking
	},
	ssr: {
		// Vite attempts to load this as a Commonjs dependency
		noExternal: ['solid-meta'],
	},
	cacheDir: 'node_modules/.cache/vite',
	assetsInclude: [/\/static\/.*$/],
});
