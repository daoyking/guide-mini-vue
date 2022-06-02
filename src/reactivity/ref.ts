import { hasChange } from "./../shared/index"
import { isTracking, trackEffect, triggerEffect } from "./effect"

class RefImpl {
	private _value: any
	public dep
	constructor(value) {
		this._value = value
		this.dep = new Set()
	}
	get value() {
		trackRefValue(this)
		return this._value
	}
	set value(newValue) {
		if (hasChange(newValue, this._value)) {
			this._value = newValue
			triggerEffect(this.dep)
		}
	}
}

function trackRefValue(ref) {
	if (isTracking()) {
		trackEffect(ref.dep)
	}
}

export function ref(value) {
	return new RefImpl(value)
}
