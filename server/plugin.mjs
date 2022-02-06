/**
 * @returns {import('vite').Plugin}
 */
const VitePluginServers = () => {
	return {
		name: 'vite-plugin-servers',
		resolveId(id) {
			if (id === '~vite') {
				return '~vite';
			}
			return null;
		},
		load(id, _) {
			if (id === '~vite') {
				return /* js */ `
export let vite = undefined;
export const setVite = (v) => (vite = v);`;
			}
			return null;
		},
	};
};

export default VitePluginServers;
