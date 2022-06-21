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
		it("simple element div", () => {
			const ast: any = baseParse("<div></div>")

			expect(ast.children[0]).toStrictEqual({
				type: NodeTypes.ELEMENT,
				tag: "div",
				children: [],
			})
		})
	})
	describe("text", () => {
		it("simple text", () => {
			const ast: any = baseParse("some text")

			expect(ast.children[0]).toStrictEqual({
				type: NodeTypes.TEXT,
				content: "some text",
			})
		})
	})

	test("hello, world", () => {
		const ast: any = baseParse("<div>hi,{{massage}}</div>")

		expect(ast.children[0]).toStrictEqual({
			type: NodeTypes.ELEMENT,
			tag: "div",
			children: [
				{
					type: NodeTypes.TEXT,
					content: "hi,",
				},
				{
					type: NodeTypes.INTERPOLATION,
					content: {
						type: NodeTypes.SIMPLE_EXPRESSION,
						content: "massage",
					},
				},
			],
		})
	})

	test("Nested element", () => {
		const ast: any = baseParse("<div><p>hi</p>{{massage}}</div>")

		expect(ast.children[0]).toStrictEqual({
			type: NodeTypes.ELEMENT,
			tag: "div",
			children: [
				{
					type: NodeTypes.ELEMENT,
					tag: "p",
					children: [
						{
							type: NodeTypes.TEXT,
							content: "hi",
						},
					],
				},
				{
					type: NodeTypes.INTERPOLATION,
					content: {
						type: NodeTypes.SIMPLE_EXPRESSION,
						content: "massage",
					},
				},
			],
		})
	})

	test("should throw error when lack end tag", () => {
		expect(() => {
			baseParse("<div><span></div>")
		}).toThrow("span缺少结束标签")
	})
})
