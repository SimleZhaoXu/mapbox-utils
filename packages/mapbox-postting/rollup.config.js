import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import { defineConfig } from 'rollup'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import fs from 'fs'
import postcss from 'rollup-plugin-postcss'
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
export default defineConfig({
  input: 'src/entry.ts',
  external: Object.keys(pkg.dependencies),
  output: [
    {
      file: 'dist/mapbox-postting.cjs.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/mapbox-postting.esm.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/mapbox-postting.min.js',
      name: 'MapBoxCpn',
      format: 'umd',
      sourcemap: true,
      globals: {
        'mapbox-gl': 'mapboxgl',
        '@turf/turf': 'turf',
        nanoid: 'nanoid'
      }
    }
  ],
  plugins: [
    commonjs({ extensions: ['.js', '.ts'] }),
    resolve({ modulesOnly: true, extensions: ['.js', '.ts'] }),
    typescript(),
    babel({
      exclude: ['**/node_modules/**'],
      babelHelpers: 'runtime',
      extensions: ['.js', '.ts']
    }),
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }),
    postcss({
      extract: 'index.css'
    })
  ]
})
