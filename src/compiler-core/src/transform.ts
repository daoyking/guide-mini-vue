import { NodeTypes } from "./ast"

export function transform(root, options) {
	const context = createTransformContext(root, options)
	// 1.遍历，深度优先搜索 ----》递归
	traverseNode(root, context)
	// 2.修改 text content
}

function createTransformContext(root, options) {
	const context = {
		root,
		nodeTransforms: options.nodeTransforms || [],
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

	traverseChildren(node, context)
}

function traverseChildren(node, context) {
	const children = node.children
	if (children) {
		for (let index = 0; index < children.length; index++) {
			const node = children[index]
			traverseNode(node, context)
		}
	}
}
