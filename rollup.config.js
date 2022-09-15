import typescript from "@rollup/plugin-typescript"

export default {
  input: './packages/vue/src/index.ts',
  output: [
    // cjs属于commonjs规范
    // esm属于es规范
    {
      format: 'cjs',
      file: 'packages/vue/dist/guide-mini-vue.cjs.js'
    },
    {
      format: 'es',
      file: 'packages/vue/dist/guide-mini-vue.esm.js'
    }
  ],
  plugins: [typescript()]
}