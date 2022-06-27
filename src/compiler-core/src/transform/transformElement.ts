import { createVNodeCall, NodeTypes } from "../ast"
import { CREATE_ELEMENT_VNODE } from "../runtimeHelpers"

export function transformElement(node: any, context) {
	if (node.type === NodeTypes.ELEMENT) {
		return () => {
			// context.helper(CREATE_ELEMENT_VNODE)

			// 中间层
			// tag
			const vnodeTag = `'${node.tag}'`
			// children
			const children = node.children
			const vnodeChildren = children[0]
			// props
			let vnodeProps

			// const vnodeElement = {
			// 	type: NodeTypes.ELEMENT,
			// 	tag: vnodeTag,
			// 	props: vnodeProps,
			// 	children: vnodeChildren,
			// }

			node.codegenNode = createVNodeCall(
				context,
				vnodeTag,
				vnodeProps,
				vnodeChildren
			)
		}
	}
}
