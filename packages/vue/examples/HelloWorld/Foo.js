import { h } from "../../dist/guide-mini-vue.esm.js"

export const Foo = {
  setup(props) {
    console.log('foo', props)
    props.count++
  },
  render() {
    return h('div', {}, 'foo:' + this.count)
  }
}