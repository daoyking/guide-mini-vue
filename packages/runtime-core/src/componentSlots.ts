import { ShapeFlags } from "@guide-mini-vue/shared";

export function initSlots(instance, children) {
	// instance.slots = Array.isArray(children) ? children : [children]
	const { vnode } = instance;
	if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
		normalizeObjectSlot(children, instance.slots);
	}
}

function normalizeObjectSlot(children, slots) {
	for (const key in children) {
		const val = children[key];
		slots[key] = (props) => normalizeSlotValue(val(props));
	}
}

function normalizeSlotValue(value) {
	return Array.isArray(value) ? value : [value];
}
