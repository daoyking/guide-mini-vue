import { NodeTypes } from "./ast"

export function baseParse(content: string) {
	const context = createParseContext(content)
	return createRoot(parseChildren(context))
}

function parseChildren(context) {
	const nodes: any = []
	let node
	const s = context.source
	if (s.startsWith("{{")) {
		node = parseInterpolation(context)
	} else if (s[0] === "<") {
		if (/[a-z]/i.test(s[1])) {
			node = parseElement(context)
		}
	}
	nodes.push(node)
	return nodes
}

const enum TagType {
	START,
	END,
}

function parseElement(context) {
	const element = parseTag(context, TagType.START)

	parseTag(context, TagType.END)

	console.log(context.source, "1111")

	return element
}

function parseTag(context: any, TagType) {
	// 1.解析tag
	const match: any = /^<\/?([a-z]*)/i.exec(context.source)
	console.log(match)
	const tag = match[1]
	// 2.删除处理完成的代码
	advanceBy(context, match[0].length)
	advanceBy(context, 1)
	// console.log(context.source)
	if (TagType === TagType.END) return
	return {
		type: NodeTypes.ELEMENT,
		tag,
	}
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
