import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'

window.self = null
export const App = {
  name: 'App',
  render() {
    window.self = this
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'hard'],
        onClick() {
          console.log('点我干嘛！')
        },
        onMousedown() {
          console.log('mousedown')
        }
      },
      // string
      // 'hi, mini-vue'
      // 'hi, ' + this.msg
      // array
      // [
      //   h('p', {class: 'red'}, 'hi'),
      //   h('p', {class: 'blue'}, 'mini-vue'),
      // ]
      [h('div', {}, 'hi, mini-vue'), h(Foo, { count: 1 })]
    )
  },
  setup() {
    return {
      msg: 'mini-vue,king'
    }
  }
}