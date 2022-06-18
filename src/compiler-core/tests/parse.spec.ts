import { NodeTypes } from "../src/ast"
import { baseParse } from "../src/parse"

describe("Parse", () => {
	describe("interpolation", () => {
		test("simple interpolation", () => {
			// root
			const ast: any = baseParse("{{massage}}")

			expect(ast.children[0]).toStrictEqual({
				type: NodeTypes.INTERPOLATION,
				content: {
					type: NodeTypes.SIMPLE_EXPRESSION,
					content: "massage",
				},
			})
		})
	})
})
