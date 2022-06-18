import { NodeTypes } from "../src/ast"
import { baseParse } from "../src/parse"

describe("Parse", () => {
	describe("interpolation", () => {
		test("simple interpolation", () => {
			const ast: any = baseParse("{{massage}}")

			// root
			expect(ast.children[0]).toStrictEqual({
				type: NodeTypes.INTERPOLATION,
				content: {
					type: NodeTypes.SIMPLE_EXPRESSION,
					content: "massage",
				},
			})
		})
	})
	describe("element", () => {
		test("simple element div", () => {
			const ast: any = baseParse("<div></div>")

			expect(ast.children[0]).toStrictEqual({
				type: NodeTypes.ELEMENT,
				tag: "div",
			})
		})
	})
})
