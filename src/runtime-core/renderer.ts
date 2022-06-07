import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
	patch(vnode, container)
}

function patch(vnode, container) {
	// 需要区分element和component
	// 如果是function就认为是component？
	// 如果是object就认为是element？
	processComponent(vnode, container)
}

function processComponent(vnode: any, container: any) {
	mountComponent(vnode, container)
}

function mountComponent(vnode: any, container) {
	const instance = createComponentInstance(vnode)
	setupComponent(instance)
	setupRenderEffect(instance, container)
}

function setupRenderEffect(instance: any, container) {
	const subTree = instance.render()
	patch(subTree, container)
}
