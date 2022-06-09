import { createRenderer } from "../runtime-core/index"

// 创建
function createElement(type) {
	return document.createElement(type)
}
// 添加属性
function patchProp(el, key, val) {
	const isOn = (key: string) => /^on[A-Z]/.test(key)
	if (isOn(key)) {
		const event = key.slice(2).toLowerCase()
		el.addEventListener(event, val)
	} else {
		el.setAttribute(key, val)
	}
}
// 添加到宿主元素中
function insert(el, parent) {
	parent.append(el)
}

const renderer: any = createRenderer({
	createElement,
	patchProp,
	insert,
})

export function createApp(...args) {
	return renderer.createApp(...args)
}

export * from "../runtime-core"
