import { h, provide, inject } from "../../lib/guide-mini-vue.esm.js"

const Provider = {
  name: 'Provider',
  setup() {
    provide('foo', 'fooVal')
    provide('bar', 'barVal')
  },
  render() {
    return h('div', {}, [h('p', {}, 'Provider'), h(Pro)])
  }
}

const Pro = {
  name: 'Pro',
  setup() {
    provide('foo', 'ProVal')
    const foo = inject('foo')
    return {
      foo
    }
  },
  render() {
    return h('div', {}, [h('p', {}, 'Pro---' + this.foo), h(Consumer)])
  }
}

const Consumer = {
  name: 'Consumer',
  setup() {
    const foo = inject('foo')
    const bar = inject('bar')
    // const baz = inject('baz', 'defaultVal')
    const baz = inject('baz', () => 'defaultVal')
    return {
      foo,bar, baz
    }
  },
  render() {
    return h('div', {}, `Consumer - ${this.foo} - ${this.bar} - ${this.baz}`)
  }
}

export const App =  {
  name: 'App',
  setup() {},
  render() {
    return h('div', {}, [h('p', {}, 'ApiProvide'), h(Provider)])
  }
}