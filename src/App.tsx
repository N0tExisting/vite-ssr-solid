import { useRoutes } from 'solid-app-router';
import { Meta, Style } from 'solid-meta';
import routes from './routes';
import './styles/global.scss';

export const App = () => {
	const Routes = useRoutes(routes);
	return (
		<>
			<Style>{
				/* css */ `html, body, #app {
					width: 100vw;
					height: 100vh;
					color: #eeeeee;
					background-color: #3a3a3a;
					contain: strict;
					margin: 0;
					padding: 0;
					border: 0;
				}`
			}</Style>
			<Meta name='viewport' content='width=device-width, initial-scale=1' />
			<Routes />
		</>
	);
};

export default App;
