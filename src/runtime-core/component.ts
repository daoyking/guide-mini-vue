export function createComponentInstance(vnode) {
	const component = {
		vnode,
		type: vnode.type,
	}
	return component
}

export function setupComponent(instance) {
	// initProps()
	// initSlots()
	setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
	const Component = instance.type

	const { setup } = Component
	if (setup) {
		const setupResult = setup()
		handleSetupResult(instance, setupResult)
	}
}
function handleSetupResult(instance: any, setupResult: any) {
	if (typeof setupResult === "object") {
		instance.setupState = setupResult
	}
	finishSetupComponent(instance)
}
function finishSetupComponent(instance: any) {
	const Component = instance.type
	// if (Component.render) {
	instance.render = Component.render
	// }
}
