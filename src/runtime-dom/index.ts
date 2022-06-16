import { createRenderer } from "../runtime-core/index"

// 创建
function createElement(type) {
	return document.createElement(type)
}
// 添加属性
function patchProp(el, key, prevProp, nextProp) {
	const isOn = (key: string) => /^on[A-Z]/.test(key)
	if (isOn(key)) {
		const event = key.slice(2).toLowerCase()
		el.addEventListener(event, nextProp)
	} else {
		if (nextProp === undefined || nextProp === null) {
			el.removeAttribute(key)
		} else {
			el.setAttribute(key, nextProp)
		}
	}
}
// 添加到宿主元素中
function insert(child, parent, anchor) {
	// parent.append(el)
	// console.log("insert:child", child)
	// console.log("insert:parent", parent)
	// console.log("insert:anchor", anchor)
	parent.insertBefore(child, anchor || null)
}

function remove(child) {
	const parent = child.parentNode
	if (parent) {
		parent.removeChild(child)
	}
}

function setElementText(el, text) {
	el.textContent = text
}

const renderer: any = createRenderer({
	createElement,
	patchProp,
	insert,
	remove,
	setElementText,
})

export function createApp(...args) {
	return renderer.createApp(...args)
}

export * from "../runtime-core"
