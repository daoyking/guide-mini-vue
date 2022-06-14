import { effect } from "../reactivity/effect"
import { EMPTY_OBJ } from "../shared"
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
		patch(null, vnode, container, null)
	}

	// n1老的vnode
	// n2新的vnode
	function patch(n1, n2, container, parentComponent) {
		// 需要区分element和component
		// 如果是object就认为是component？
		// 如果是string就认为是element？
		// console.log("111", vnode.type)
		// Fragment 只渲染children
		const { shapeFlag, type } = n2
		switch (type) {
			case Fragment:
				processFragment(n1, n2, container, parentComponent)
				break
			case Text:
				processText(n1, n2, container)
				break
			default:
				if (shapeFlag & ShapeFlags.ELEMENT) {
					processElement(n1, n2, container, parentComponent)
				} else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
					processComponent(n1, n2, container, parentComponent)
				}
				break
		}
	}

	function processComponent(n1, n2: any, container: any, parentComponent) {
		mountComponent(n2, container, parentComponent)
	}

	function mountComponent(initialVNode: any, container, parentComponent) {
		const instance = createComponentInstance(initialVNode, parentComponent)
		setupComponent(instance)
		setupRenderEffect(instance, initialVNode, container)
	}

	function setupRenderEffect(instance: any, initialVNode, container) {
		effect(() => {
			if (!instance.isMounted) {
				console.log("init")
				const { proxy } = instance

				const subTree = (instance.subTree = instance.render.call(proxy))

				patch(null, subTree, container, instance)

				//只有当全部的element渲染完毕，才能获取到el
				initialVNode.el = subTree.el
				instance.isMounted = true
			} else {
				console.log("update")
				const { proxy } = instance
				const subTree = instance.render.call(proxy)
				const prevSubTree = instance.subTree
				instance.subTree = subTree
				patch(prevSubTree, subTree, container, instance)
			}
		})
	}

	function processElement(n1, n2: any, container: any, parentComponent) {
		// n1不存在，说明是初始化状态
		if (!n1) {
			mountElement(n2, container, parentComponent)
		} else {
			patchElement(n1, n2, container)
		}
	}

	function patchElement(n1, n2, container) {
		console.log("n1", n1)
		console.log("n2", n2)
		console.log("patchElement")
		const oldProps = n1.props || EMPTY_OBJ
		const newProps = n2.props || EMPTY_OBJ

		const el = (n2.el = n1.el)

		patchProps(el, oldProps, newProps)
	}

	function patchProps(el, oldProps, newProps) {
		if (oldProps !== newProps) {
			for (const key in newProps) {
				const prevProp = oldProps[key]
				const nextProp = newProps[key]
				if (prevProp !== nextProp) {
					hostPatchProp(el, key, prevProp, nextProp)
				}
			}
			if (oldProps !== EMPTY_OBJ) {
				for (const key in oldProps) {
					if (!(key in newProps)) {
						hostPatchProp(el, key, oldProps[key], null)
					}
				}
			}
		}
	}

	function mountElement(vnode: any, container: any, parentComponent) {
		// string array
		const el = (vnode.el = hostCreateElement(vnode.type))
		const { children, shapeFlag } = vnode

		// children
		if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
			el.textContent = children
		} else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
			mountChildren(vnode, el, parentComponent)
		}

		// 处理props
		const { props } = vnode
		for (const key in props) {
			const val = props[key]
			hostPatchProp(el, key, null, val)
		}
		// 添加到宿主元素中
		// container.append(el)
		hostInsert(el, container)
	}

	function mountChildren(vnode, container, parentComponent) {
		vnode.children.forEach(function (v) {
			patch(null, v, container, parentComponent)
		})
	}
	function processFragment(n1, n2: any, container: any, parentComponent) {
		mountChildren(n2, container, parentComponent)
	}
	function processText(n1, n2: any, container: any) {
		const { children } = n2
		const textNode = (n2.el = document.createTextNode(children))
		container.append(textNode)
	}

	return {
		createApp: createAppAPI(render),
	}
}
