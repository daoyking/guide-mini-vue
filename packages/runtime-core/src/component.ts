import { proxyRefs, shallowReadonly } from "@guide-mini-vue/reactivity";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";

let currentInstance = null;
export function createComponentInstance(vnode, parent) {
	const component = {
		vnode,
		type: vnode.type,
		setupState: {},
		props: {},
		slots: {},
		provides: parent ? parent.provides : {},
		parent,
		isMounted: false,
		subTree: {},
		emit: () => {},
		next: null,
	};
	component.emit = emit.bind(null, component) as any;
	return component;
}

export function setupComponent(instance) {
	initProps(instance, instance.vnode.props);
	initSlots(instance, instance.vnode.children);
	setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
	const Component = instance.type;

	// ctx
	instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);

	const { setup } = Component;
	if (setup) {
		setCurrentInstance(instance);
		const setupResult = setup(shallowReadonly(instance.props), {
			emit: instance.emit,
		});
		setCurrentInstance(null);
		handleSetupResult(instance, setupResult);
	}
}
function handleSetupResult(instance: any, setupResult: any) {
	if (typeof setupResult === "object") {
		instance.setupState = proxyRefs(setupResult);
	}
	finishSetupComponent(instance);
}

//
function finishSetupComponent(instance: any) {
	const Component = instance.type;
	if (compiler && !Component.render) {
		if (Component.template) {
			Component.render = compiler(Component.template);
		}
	}
	// template
	instance.render = Component.render;
}

// 设置组件实例
export function setCurrentInstance(instance) {
	currentInstance = instance;
}

// 获取组件实例的方法
export function getCurrentInstance() {
	return currentInstance;
}

let compiler;

export function registerRuntimeCompiler(_compiler) {
	compiler = _compiler;
}
