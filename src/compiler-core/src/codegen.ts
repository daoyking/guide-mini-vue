export function generate(ast) {
	// let code = ""
	// code += "return "
	const context = createCodegenContext()
	const { push } = context
	push("return ")
	const functionName = "render"
	const args = ["_ctx", "_cache"]
	const signature = args.join(",")
	// code += `function ${functionName}(${signature}){`
	push(`function ${functionName}(${signature}){`)

	// const node = ast.codegenNode
	// code += `return '${node.content}'`
	// code += `return`
	push(`return`)
	genNode(ast.codegenNode, context)
	// code += `}`
	push(`}`)
	return {
		code: context.code,
	}
}

function createCodegenContext(): any {
	const context = {
		code: "",
		push(source) {
			context.code += source
		},
	}
	return context
}

function genNode(node, context) {
	const { push } = context
	// const node = ast.codegenNode
	push(` '${node.content}'`)
	// code += `return '${node.content}'`
	// return code
}
