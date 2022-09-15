import {
	CREATE_ELEMENT_VNODE,
	helperMapName,
	TO_DISPLAY_STRING,
} from "./runtimeHelpers";
import { NodeTypes } from "./ast";
import { isString } from "@guide-mini-vue/shared";

export function generate(ast) {
	// let code = ""
	// code += "return "
	const context = createCodegenContext();
	const { push } = context;

	// const VueBinging = "Vue"
	// const aliasHelpers = (s) => `${s}: _${s}`
	// push(`const { ${ast.helpers.map(aliasHelpers).join(",")} = ${VueBinging}`)
	// push("\n")
	// push("return ")
	genFunctionPreamble(ast, context);
	const functionName = "render";
	const args = ["_ctx", "_cache"];
	const signature = args.join(",");
	// code += `function ${functionName}(${signature}){`
	push(`function ${functionName}(${signature}){`);

	// const node = ast.codegenNode
	// code += `return '${node.content}'`
	// code += `return`
	push(`return `);
	genNode(ast.codegenNode, context);
	// code += `}`
	push(`}`);
	return {
		code: context.code,
	};
}

function genFunctionPreamble(ast, context) {
	const { push } = context;
	const VueBinging = "Vue";
	const aliasHelpers = (s) => `${helperMapName[s]}: _${helperMapName[s]}`;
	if (ast.helpers.length > 0) {
		push(
			`const { ${ast.helpers.map(aliasHelpers).join(",")} } = ${VueBinging}`
		);
	}
	push("\n");
	push("return ");
}

function createCodegenContext(): any {
	const context = {
		code: "",
		push(source) {
			context.code += source;
		},
		helper(key) {
			return `_${helperMapName[key]}`;
		},
	};
	return context;
}

function genNode(node, context) {
	switch (node.type) {
		case NodeTypes.TEXT:
			genText(node, context);
			break;
		case NodeTypes.INTERPOLATION:
			genInterpolation(node, context);
			break;
		case NodeTypes.SIMPLE_EXPRESSION:
			genExpression(node, context);
			break;
		case NodeTypes.ELEMENT:
			genElement(node, context);
			break;
		case NodeTypes.COMPOUND_EXPRESSION:
			genCompoundExpression(node, context);
			break;
		default:
			break;
	}
}

function genCompoundExpression(node, context) {
	const { children } = node;
	const { push } = context;
	for (let index = 0; index < children.length; index++) {
		const child = children[index];
		if (isString(child)) {
			push(child);
		} else {
			genNode(child, context);
		}
	}
}

function genElement(node, context) {
	const { push, helper } = context;
	const { tag, children, props } = node;
	push(`${helper(CREATE_ELEMENT_VNODE)}(`);
	// const child = children[0]
	// for (let index = 0; index < children.length; index++) {
	// 	const child = children[index]
	// 	genNode(child, context)
	// }
	genNodeList(genNullable([tag, props, children]), context);
	// genNode(children, context)
	push(")");
}

function genNodeList(nodes, context) {
	const { push } = context;

	for (let index = 0; index < nodes.length; index++) {
		const node = nodes[index];
		if (isString(node)) {
			push(node);
		} else {
			genNode(node, context);
		}

		if (index < nodes.length - 1) {
			push(",");
		}
	}
}

function genNullable(args: any) {
	return args.map((arg) => arg || "null");
}

function genExpression(node, context) {
	const { push } = context;
	push(`${node.content}`);
}

function genText(node, context) {
	const { push } = context;
	push(`'${node.content}'`);
}

function genInterpolation(node, context) {
	const { push, helper } = context;
	push(`${helper(TO_DISPLAY_STRING)}(`);
	genNode(node.content, context);
	push(")");
}
