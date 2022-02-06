import type { Component } from 'solid-js';
import { hydrate } from 'solid-js/web';
import { MetaProvider } from 'solid-meta';
import { Router } from 'solid-app-router';
import { App } from './App';

const Browser: Component = () => {
	return (
		<MetaProvider>
			<Router>
				<App />
			</Router>
		</MetaProvider>
	);
};

hydrate(() => <Browser />, document.getElementById('app')!);
