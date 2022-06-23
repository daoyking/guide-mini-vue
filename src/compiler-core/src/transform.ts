import { NodeTypes } from "./ast"
import { TO_DISPLAY_STRING } from "./runtimeHelpers"

export function transform(root, options = {}) {
	const context = createTransformContext(root, options)
	// 1.遍历，深度优先搜索 ----》递归
	traverseNode(root, context)
	// 2.修改 text content

	createCodegen(root)

	root.helpers = [...context.helpers.keys()]
}

function createCodegen(root) {
	root.codegenNode = root.children[0]
}

function createTransformContext(root, options) {
	const context = {
		root,
		nodeTransforms: options.nodeTransforms || [],
		helpers: new Map(),
		helper(key) {
			context.helpers.set(key, 1)
		},
	}
	return context
}

function traverseNode(node, context) {
	console.log("node:", node)

	// if (node.type === NodeTypes.TEXT) {
	// 	node.content = node.content + "mini-vue"
	// }
	const nodeTransforms = context.nodeTransforms
	for (let index = 0; index < nodeTransforms.length; index++) {
		const transform = nodeTransforms[index]
		transform(node)
	}

	switch (node.type) {
		case NodeTypes.INTERPOLATION:
			context.helper(TO_DISPLAY_STRING)
			break
		case NodeTypes.ELEMENT:
		case NodeTypes.ROOT:
			traverseChildren(node, context)
			break
		default:
			break
	}
}

function traverseChildren(node, context) {
	const children = node.children
	// if (children) {
	for (let index = 0; index < children.length; index++) {
		const node = children[index]
		traverseNode(node, context)
	}
	// }
}
