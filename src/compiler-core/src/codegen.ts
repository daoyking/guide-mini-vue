import { helperMapName, TO_DISPLAY_STRING } from "./runtimeHelpers"
import { NodeTypes } from "./ast"

export function generate(ast) {
	// let code = ""
	// code += "return "
	const context = createCodegenContext()
	const { push } = context

	// const VueBinging = "Vue"
	// const aliasHelpers = (s) => `${s}: _${s}`
	// push(`const { ${ast.helpers.map(aliasHelpers).join(",")} = ${VueBinging}`)
	// push("\n")
	// push("return ")
	genFunctionPreamble(ast, context)
	const functionName = "render"
	const args = ["_ctx", "_cache"]
	const signature = args.join(",")
	// code += `function ${functionName}(${signature}){`
	push(`function ${functionName}(${signature}){`)

	// const node = ast.codegenNode
	// code += `return '${node.content}'`
	// code += `return`
	push(`return `)
	genNode(ast.codegenNode, context)
	// code += `}`
	push(`}`)
	return {
		code: context.code,
	}
}

function genFunctionPreamble(ast, context) {
	const { push } = context
	const VueBinging = "Vue"
	const aliasHelpers = (s) => `${helperMapName[s]}: _${helperMapName[s]}`
	if (ast.helpers.length > 0) {
		push(`const { ${ast.helpers.map(aliasHelpers).join(",")} } = ${VueBinging}`)
	}
	push("\n")
	push("return ")
}

function createCodegenContext(): any {
	const context = {
		code: "",
		push(source) {
			context.code += source
		},
		helper(key) {
			return `_${helperMapName[key]}`
		},
	}
	return context
}

function genNode(node, context) {
	switch (node.type) {
		case NodeTypes.TEXT:
			genText(node, context)
			break
		case NodeTypes.INTERPOLATION:
			genInterpolation(node, context)
			break
		case NodeTypes.SIMPLE_EXPRESSION:
			genExpression(node, context)
		default:
			break
	}
}

function genExpression(node, context) {
	const { push } = context
	push(`${node.content}`)
}

function genText(node, context) {
	const { push } = context
	push(`'${node.content}'`)
}

function genInterpolation(node, context) {
	const { push, helper } = context
	push(`${helper(TO_DISPLAY_STRING)}(`)
	genNode(node.content, context)
	push(")")
}
