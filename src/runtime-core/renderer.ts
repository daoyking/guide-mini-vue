import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { createAppAPI } from "./createApp"
import { Fragment, Text } from "./vnode"

export function createRenderer(options) {
	const {
		createElement: hostCreateElement,
		patchProp: hostPatchProp,
		insert: hostInsert,
	} = options

	function render(vnode, container) {
		patch(vnode, container, null)
	}

	function patch(vnode, container, parentComponent) {
		// 需要区分element和component
		// 如果是object就认为是component？
		// 如果是string就认为是element？
		// console.log("111", vnode.type)
		// Fragment 只渲染children
		const { shapeFlag, type } = vnode
		switch (type) {
			case Fragment:
				processFragment(vnode, container, parentComponent)
				break
			case Text:
				processText(vnode, container)
				break
			default:
				if (shapeFlag & ShapeFlags.ELEMENT) {
					processElement(vnode, container, parentComponent)
				} else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
					processComponent(vnode, container, parentComponent)
				}
				break
		}
	}

	function processComponent(vnode: any, container: any, parentComponent) {
		mountComponent(vnode, container, parentComponent)
	}

	function mountComponent(vnode: any, container, parentComponent) {
		const instance = createComponentInstance(vnode, parentComponent)
		setupComponent(instance)
		setupRenderEffect(instance, vnode, container)
	}

	function setupRenderEffect(instance: any, vnode, container) {
		const { proxy } = instance
		const subTree = instance.render.call(proxy)
		patch(subTree, container, instance)

		//只有当全部的element渲染完毕，才能获取到el
		vnode.el = subTree.el
	}

	function processElement(vnode: any, container: any, parentComponent) {
		mountElement(vnode, container, parentComponent)
	}

	function mountElement(vnode: any, container: any, parentComponent) {
		// string array
		const { type, children, props, shapeFlag } = vnode
		// const el = (vnode.el = document.createElement(type))
		const el = (vnode.el = hostCreateElement(type))
		if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
			el.textContent = children
		} else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
			mountChildren(vnode, el, parentComponent)
		}

		// 处理props
		for (const key in props) {
			const val = props[key]
			// const isOn = (key: string) => /^on[A-Z]/.test(key)
			// if (isOn(key)) {
			// 	const event = key.slice(2).toLowerCase()
			// 	el.addEventListener(event, val)
			// } else {
			// 	el.setAttribute(key, val)
			// }
			hostPatchProp(el, key, val)
		}
		// 添加到宿主元素中
		// container.append(el)
		hostInsert(el, container)
	}

	function mountChildren(vnode, container, parentComponent) {
		vnode.children.forEach(function (v) {
			patch(v, container, parentComponent)
		})
	}
	function processFragment(vnode: any, container: any, parentComponent) {
		mountChildren(vnode, container, parentComponent)
	}
	function processText(vnode: any, container: any) {
		const { children } = vnode
		const textNode = (vnode.el = document.createTextNode(children))
		container.append(textNode)
	}

	return {
		createApp: createAppAPI(render),
	}
}
