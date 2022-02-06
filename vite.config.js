// @ts-check
/// <reference path="./vite-config.d.ts" />
import { builtinModules } from 'node:module';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import solid from 'vite-plugin-solid';
import pages from 'vite-plugin-pages-solid';
import Servers from './server/plugin.mjs';

export default defineConfig({
	cacheDir: 'node_modules/.cache/vite',
	assetsInclude: [/\/static\/.*$/],
	plugins: [
		tsconfigPaths(),
		solid({ ssr: true }),
		pages({
			pagesDir: 'src/routes',
			importMode: 'async',
			syncIndex: false,
		}),
		Servers(),
	],
	build: {
		manifest: true,
		ssrManifest: true,
		sourcemap: true,
		polyfillModulePreload: false,
		assetsInlineLimit: 256,
	},
	server: {
		middlewareMode: 'ssr',
	},
	resolve: {
		preserveSymlinks: true, // Avoid errors with pnpm linking
	},
	ssr: {
		external: [...builtinModules],
		noExternal: [
			// Vite attempts to load this as a Commonjs dependency
			'solid-meta',
		],
	},
});
