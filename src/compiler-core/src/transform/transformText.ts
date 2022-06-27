import { NodeTypes } from "../ast"
import { isText } from "../util"

export function transformText(node) {
	return () => {
		const { children, type } = node
		if (type === NodeTypes.ELEMENT) {
			let currentContainer
			for (let index = 0; index < children.length; index++) {
				const child = children[index]
				if (isText(child)) {
					for (let j = index + 1; j < children.length; j++) {
						const next = children[j]
						if (isText(next)) {
							if (!currentContainer) {
								currentContainer = children[index] = {
									type: NodeTypes.COMPOUND_EXPRESSION,
									children: [child],
								}
							}
							currentContainer.children.push(" + ")
							currentContainer.children.push(next)
							children.splice(j, 1)
							j--
						} else {
							currentContainer = undefined
							break
						}
					}
				}
			}
		}
	}
}
