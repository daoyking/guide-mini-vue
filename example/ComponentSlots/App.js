import { h, createTextVNode } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  setup(props) {},
  render() {
    const app = h('div', {}, 'App')
    const foo = h(Foo, {}, {
      header: ({ age }) => [h('p', {}, 'header' + age), createTextVNode('哈哈哈')],
      footer: () => h('p', {}, 'footer')
    })
    // const foo = h(Foo, {}, h('p', {}, '567'))
    return h('div', {}, [app, foo])
  }
}