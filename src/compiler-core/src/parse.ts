import { NodeTypes } from "./ast"

const enum TagType {
	Start,
	End,
}

export function baseParse(content: string) {
	const context = createParseContext(content)
	return createRoot(parseChildren(context, []))
}

function parseChildren(context, ancestors) {
	const nodes: any = []
	while (!isEnd(context, ancestors)) {
		let node
		const s = context.source
		if (s.startsWith("{{")) {
			node = parseInterpolation(context)
		} else if (s[0] === "<") {
			if (/[a-z]/i.test(s[1])) {
				node = parseElement(context, ancestors)
			}
		}

		if (!node) {
			node = parseText(context)
		}
		nodes.push(node)
	}

	return nodes
}

function isEnd(context, ancestors) {
	// console.log("isEnd:", ancestors)
	const s = context.source
	// 2.遇到为结束标签
	// if (ancestors && s.startsWith(`</${ancestors}>`)) {
	// 	return true
	// }
	if (s.startsWith("</")) {
		for (let index = 0; index < ancestors.length; index++) {
			const tag = ancestors[index].tag
			// if (s.slice(2, 2 + tag.length) === tag) {
			if (startsWithEndTagOpen(s, tag)) {
				return true
			}
		}
	}
	// 1.source 有值
	return !s
}

function parseText(context) {
	const endTokens = ["<", "{{"]
	let endIndex = context.source.length

	for (let i = 0; i < endTokens.length; i++) {
		const index = context.source.indexOf(endTokens[i])
		if (index !== -1 && endIndex > index) {
			endIndex = index
		}
	}

	//1.获取内容 content
	const content = parseTextData(context, endIndex)
	// 2. 推进 -》 删除处理完成的代码？？？
	// advanceBy(context, content.length)

	return {
		type: NodeTypes.TEXT,
		content,
	}
}

function parseTextData(context, length) {
	const content = context.source.slice(0, length)

	// 2. 推进 -》 删除处理完成的代码？？？
	advanceBy(context, length)

	return content
}

function parseElement(context, ancestors) {
	const element: any = parseTag(context, TagType.Start)
	ancestors.push(element)
	element.children = parseChildren(context, ancestors)
	ancestors.pop()
	if (startsWithEndTagOpen(context.source, element.tag)) {
		parseTag(context, TagType.End)
	} else {
		throw new Error(`${element.tag}缺少结束标签`)
	}

	// console.log(context.source, "1111")

	return element
}

function startsWithEndTagOpen(source, tag) {
	return (
		source.startsWith("</") &&
		source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
	)
}

function parseTag(context: any, type) {
	// 1.解析tag
	const match: any = /^<\/?([a-z]*)/i.exec(context.source)
	// console.log(match, "match")
	const tag = match[1]
	// 2.删除处理完成的代码
	advanceBy(context, match[0].length)
	advanceBy(context, 1)
	// console.log(context.source)
	if (type === TagType.End) return
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
	// advanceBy(context, 2)

	const rawContentLength = closeIndex - openDelimiter.length
	const rawContent = parseTextData(context, rawContentLength) //context.source.slice(0, rawContentLength)
	const content = rawContent.trim()

	// context.source = context.source.slice(
	// 	rawContentLength + closeDelimiter.length
	// )
	advanceBy(context, closeDelimiter.length)
	return {
		type: NodeTypes.INTERPOLATION,
		content: {
			type: NodeTypes.SIMPLE_EXPRESSION,
			content,
		},
	}
}

function advanceBy(context, length) {
	context.source = context.source.slice(length)
}

function createRoot(children) {
	return {
		children,
		type: NodeTypes.ROOT,
	}
}

function createParseContext(content) {
	return {
		source: content,
	}
}
