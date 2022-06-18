import { NodeTypes } from "./ast"

export function baseParse(content: string) {
	const context = createParseContext(content)
	return createRoot(parseChildren(context))
}

function parseChildren(context) {
	const nodes: any = []
	let node
	if (context.source.startsWith("{{")) {
		node = parseInterpolation(context)
	}
	nodes.push(node)
	return nodes
}

function parseInterpolation(context) {
	const openDelimiter = "{{"
	const closeDelimiter = "}}"

	const closeIndex = context.source.indexOf(
		closeDelimiter,
		openDelimiter.length
	)
	// context.source = context.source.slice(openDelimiter.length)
	advanceBy(context, openDelimiter.length)

	const rawContentLength = closeIndex - openDelimiter.length
	const rawContent = context.source.slice(0, rawContentLength)
	const content = rawContent.trim()

	// context.source = context.source.slice(
	// 	rawContentLength + closeDelimiter.length
	// )
	advanceBy(context, rawContentLength + closeDelimiter.length)
	return {
		type: NodeTypes.INTERPOLATION,
		content: {
			type: NodeTypes.SIMPLE_EXPRESSION,
			content: content,
		},
	}
}

function advanceBy(context, length) {
	context.source = context.source.slice(length)
}

function createRoot(children) {
	return {
		children,
	}
}

function createParseContext(content) {
	return {
		source: content,
	}
}
