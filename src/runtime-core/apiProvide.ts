import { getCurrentInstance } from "./component"

export function provide(key, value) {
	// 存数组
	// getCurrentInstance因为是在setup中添加的，所以要先看看是否存在
	const currentInstance: any = getCurrentInstance()
	if (currentInstance) {
		let { provides } = currentInstance
		const parentProvides = currentInstance.parent.provides
		// 只有第一次才需要init
		if (provides === parentProvides) {
			provides = currentInstance.provides = Object.create(parentProvides)
		}
		provides[key] = value
	}
}
export function inject(key, defaultVal) {
	// 取数据
	const currentInstance: any = getCurrentInstance()
	if (currentInstance) {
		const parentProvides = currentInstance.parent.provides
		if (key in parentProvides) {
			return parentProvides[key]
		} else if (defaultVal) {
			if (typeof defaultVal === "function") {
				return defaultVal()
			}
			return defaultVal
		}
	}
}
