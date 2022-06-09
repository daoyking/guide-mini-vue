import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { Fragment, Text } from "./vnode"

export function render(vnode, container) {
	patch(vnode, container)
}

function patch(vnode, container) {
	// 需要区分element和component
	// 如果是object就认为是component？
	// 如果是string就认为是element？
	// console.log("111", vnode.type)
	// Fragment 只渲染children
	const { shapeFlag, type } = vnode
	switch (type) {
		case Fragment:
			processFragment(vnode, container)
			break
		case Text:
			processText(vnode, container)
			break
		default:
			if (shapeFlag & ShapeFlags.ELEMENT) {
				processElement(vnode, container)
			} else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
				processComponent(vnode, container)
			}
			break
	}
}

function processComponent(vnode: any, container: any) {
	mountComponent(vnode, container)
}

function mountComponent(vnode: any, container) {
	const instance = createComponentInstance(vnode)
	setupComponent(instance)
	setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(instance: any, vnode, container) {
	const { proxy } = instance
	const subTree = instance.render.call(proxy)
	patch(subTree, container)

	//只有当全部的element渲染完毕，才能获取到el
	vnode.el = subTree.el
}

function processElement(vnode: any, container: any) {
	mountElement(vnode, container)
}

function mountElement(vnode: any, container: any) {
	// string array
	const { type, children, props, shapeFlag } = vnode
	const el = (vnode.el = document.createElement(type))
	if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
		el.textContent = children
	} else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
		mountChildren(vnode, el)
	}

	// 处理props
	for (const key in props) {
		const val = props[key]
		const isOn = (key: string) => /^on[A-Z]/.test(key)
		if (isOn(key)) {
			const event = key.slice(2).toLowerCase()
			el.addEventListener(event, val)
		} else {
			el.setAttribute(key, val)
		}
	}
	// 添加到宿主元素中
	container.append(el)
}

function mountChildren(vnode, container) {
	vnode.children.forEach(function (v) {
		patch(v, container)
	})
}
function processFragment(vnode: any, container: any) {
	mountChildren(vnode, container)
}
function processText(vnode: any, container: any) {
	const { children } = vnode
	const textNode = (vnode.el = document.createTextNode(children))
	container.append(textNode)
}
