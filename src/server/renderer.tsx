import type { Component } from 'solid-js';
import { renderToString, generateHydrationScript } from 'solid-js/web';
import { Router, RouteDataFunc, RouterOutput } from 'solid-app-router';
import { renderTags, MetaProvider } from 'solid-meta';
import { App } from '../App';

export interface TagDescription {
	tag: string;
	props: Record<string, unknown>;
}

export interface ServerProps {
	tags: TagDescription[];
	url: string;
	out?: object | RouterOutput | {};
	data?: RouteDataFunc;
}

const Server: Component<ServerProps> = (props) => {
	return (
		<MetaProvider tags={props.tags}>
			<Router url={props.url} out={props.out} data={props.data}>
				<App />
			</Router>
		</MetaProvider>
	);
};

export function render(url: string) {
	let tags: TagDescription[] = [];
	const out = {};
	const body = renderToString(() => <Server tags={tags} url={url} out={out} />);
	const hydration = generateHydrationScript();
	const head = renderTags(tags);
	return {
		head,
		hydration,
		body,
		ctx: out as RouterOutput,
	};
}

export const ServerComponent = Server;
export const handlers = import.meta.globEager('./routes/api/**/*.ts');
export const pages = import.meta.globEager('./routes/**/*.tsx');
