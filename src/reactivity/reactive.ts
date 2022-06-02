import {
	mutableHandles,
	readonlyHandles,
	shallowReadonlyHandles,
} from "../reactivity/baseHandles"

export const enum ReactiveFlags {
	IS_REACTIVE = "__v_isReactive",
	IS_READONLY = "__v_isReadonly",
}

export function reactive(raw) {
	return createActiveObject(raw, mutableHandles)
}

export function readonly(raw) {
	return createActiveObject(raw, readonlyHandles)
}

export function shallowReadonly(raw) {
	return createActiveObject(raw, shallowReadonlyHandles)
}

export function isReactive(value): Boolean {
	return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value): Boolean {
	return !!value[ReactiveFlags.IS_READONLY]
}

export function isProxy(value): Boolean {
	return isReactive(value) || isReadonly(value)
}

function createActiveObject(raw: any, baseHandles) {
	return new Proxy(raw, baseHandles)
}
