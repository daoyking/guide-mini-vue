import pkg from './package.json'
import typescript from "@rollup/plugin-typescript"

export default {
  input: './src/index.ts',
  output: [
    // cjs属于commonjs规范
    // esm属于es规范
    {
      format: 'cjs',
      file: pkg.main
    },
    {
      format: 'es',
      file: pkg.module
    }
  ],
  plugins: [typescript()]
}