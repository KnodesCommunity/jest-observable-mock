import { dirname, resolve } from 'path';

import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import { dualBuild } from '@knodes/dev-utils/build/rollup';

export default dualBuild( 'src', 'dist', {
	plugins: ( { libRoot, buildTs } ) => [
		nodeResolve(),
		commonjs(),
		buildTs( resolve( dirname( libRoot ), 'tsconfig.json' ) ),
	],
} );
