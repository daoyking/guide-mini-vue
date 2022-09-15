
import { h, ref, nextTick, getCurrentInstance } from '../../lib/guide-mini-vue.esm.js'
export const App = {
  name: 'App',
  setup() {
    const count = ref(1)
    const instance = getCurrentInstance()
    function onClick() {
      for (let index = 0; index < 100; index++) {
        console.log('update')
        count.value = index
      }
    }

    console.log('111', instance)
    nextTick(() => {
      console.log('222', instance)
    })

    return {
      count,
      onClick,
    }
  },
  render() {
    const btn = h('button', { onClick: this.onClick }, 'update')
    const p = h('p', {}, 'count:' + this.count)
    return h('div', {}, [btn, p]
    )
  }
}