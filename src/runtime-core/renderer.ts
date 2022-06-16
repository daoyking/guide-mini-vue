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
		remove: hostRemove,
		setElementText: hostSetElementText,
	} = options

	function render(vnode, container) {
		patch(null, vnode, container, null, null)
	}

	// n1老的vnode
	// n2新的vnode
	function patch(n1, n2, container, parentComponent, anchor) {
		// 需要区分element和component
		// 如果是object就认为是component？
		// 如果是string就认为是element？
		// console.log("111", vnode.type)
		// Fragment 只渲染children
		const { shapeFlag, type } = n2
		switch (type) {
			case Fragment:
				processFragment(n1, n2, container, parentComponent, anchor)
				break
			case Text:
				processText(n1, n2, container)
				break
			default:
				if (shapeFlag & ShapeFlags.ELEMENT) {
					processElement(n1, n2, container, parentComponent, anchor)
				} else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
					processComponent(n1, n2, container, parentComponent, anchor)
				}
				break
		}
	}

	function processComponent(
		n1,
		n2: any,
		container: any,
		parentComponent,
		anchor
	) {
		mountComponent(n2, container, parentComponent, anchor)
	}

	function mountComponent(
		initialVNode: any,
		container,
		parentComponent,
		anchor
	) {
		const instance = createComponentInstance(initialVNode, parentComponent)
		setupComponent(instance)
		setupRenderEffect(instance, initialVNode, container, anchor)
	}

	function setupRenderEffect(instance: any, initialVNode, container, anchor) {
		effect(() => {
			if (!instance.isMounted) {
				// console.log("init")
				const { proxy } = instance

				const subTree = (instance.subTree = instance.render.call(proxy))

				patch(null, subTree, container, instance, anchor)

				//只有当全部的element渲染完毕，才能获取到el
				initialVNode.el = subTree.el
				instance.isMounted = true
			} else {
				// console.log("update")
				const { proxy } = instance
				const subTree = instance.render.call(proxy)
				const prevSubTree = instance.subTree
				instance.subTree = subTree
				patch(prevSubTree, subTree, container, instance, anchor)
			}
		})
	}

	function processElement(
		n1,
		n2: any,
		container: any,
		parentComponent,
		anchor
	) {
		// n1不存在，说明是初始化状态
		if (!n1) {
			mountElement(n2, container, parentComponent, anchor)
		} else {
			patchElement(n1, n2, container, parentComponent, anchor)
		}
	}

	function patchElement(n1, n2, container, parentComponent, anchor) {
		// console.log("n1", n1)
		// console.log("n2", n2)
		// console.log("patchElement")
		const oldProps = n1.props || EMPTY_OBJ
		const newProps = n2.props || EMPTY_OBJ

		const el = (n2.el = n1.el)

		patchChildren(n1, n2, el, parentComponent, anchor)
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

	function mountElement(vnode: any, container: any, parentComponent, anchor) {
		// string array
		const el = (vnode.el = hostCreateElement(vnode.type))
		const { children, shapeFlag } = vnode

		// children
		if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
			el.textContent = children
		} else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
			mountChildren(vnode.children, el, parentComponent, anchor)
		}

		// 处理props
		const { props } = vnode
		for (const key in props) {
			const val = props[key]
			hostPatchProp(el, key, null, val)
		}
		// 添加到宿主元素中
		// container.append(el)
		hostInsert(el, container, anchor)
	}

	function mountChildren(children, container, parentComponent, anchor) {
		children.forEach(function (v) {
			patch(null, v, container, parentComponent, anchor)
		})
	}

	function processFragment(
		n1,
		n2: any,
		container: any,
		parentComponent,
		anchor
	) {
		mountChildren(n2.children, container, parentComponent, anchor)
	}

	function processText(n1, n2: any, container: any) {
		const { children } = n2
		const textNode = (n2.el = document.createTextNode(children))
		container.append(textNode)
	}

	function patchChildren(
		n1: any,
		n2: any,
		container: any,
		parentComponent,
		anchor
	) {
		const prevShapeFlag = n1.shapeFlag
		const { shapeFlag } = n2
		const child1 = n1.children
		const child2 = n2.children

		if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
			if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
				// 1.清空old children
				unmountChildren(n1.children)
				// 2.设置text
				// hostSetElementText(container, child2)
			}
			if (child1 !== child2) {
				hostSetElementText(container, child2)
			}
		} else {
			if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
				hostSetElementText(container, "")
				mountChildren(child2, container, parentComponent, anchor)
			} else {
				patchKeyedChildren(child1, child2, container, parentComponent, anchor)
			}
		}
	}

	function patchKeyedChildren(
		child1,
		child2,
		container,
		parentComponent,
		parentAnchor
	) {
		let i = 0
		let e1 = child1.length - 1
		let l2 = child2.length
		let e2 = l2 - 1

		function isSomeVNodeType(n1, n2) {
			// type
			// key
			return n1.type === n2.type && n1.key === n2.key
		}

		// 左侧
		while (i <= e1 && i <= e2) {
			const n1 = child1[i]
			const n2 = child2[i]
			if (isSomeVNodeType(n1, n2)) {
				patch(n1, n2, container, parentComponent, parentAnchor)
			} else {
				break
			}
			i++
		}

		// 右侧
		while (i <= e1 && i <= e2) {
			const n1 = child1[e1]
			const n2 = child2[e2]
			if (isSomeVNodeType(n1, n2)) {
				patch(n1, n2, container, parentComponent, parentAnchor)
			} else {
				break
			}
			e1--
			e2--
		}

		// 3. 新的比老的长 创建
		if (i > e1) {
			if (i <= e2) {
				const nextPos = e2 + 1
				const anchor = nextPos < l2 ? child2[nextPos].el : null
				while (i <= e2) {
					patch(null, child2[i], container, parentComponent, anchor)
					i++
				}
			}
			// 4. 老的比新的长 删除老的
		} else if (i > e2) {
			while (i <= e1) {
				hostRemove(child1[i].el)
				i++
			}
		}
	}

	function unmountChildren(children) {
		for (let index = 0; index < children.length; index++) {
			const el = children[index].el
			hostRemove(el)
		}
	}

	return {
		createApp: createAppAPI(render),
	}
}
