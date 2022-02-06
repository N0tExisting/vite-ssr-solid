import { SSROptions } from 'vite';

declare module 'vite' {
	interface UserConfig {
		ssr?: SSROptions;
	}
}
