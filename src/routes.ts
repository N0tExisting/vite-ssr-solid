import { useRoutes } from 'solid-app-router';
import routes from 'virtual:generated-pages-solid';

if (import.meta.env.DEV) console.log('Routes:\n', routes);

export { routes };

export default (base?: string | undefined) => useRoutes(routes, base);
