import { ReactiveEffect } from "../../reactivity/src/effect";
import { queuePreFlushCb } from "./scheduler";
export function watchEffect(source) {
	function job() {
		effect.run();
	}
	let cleanup;
	const oncleanup = function (fn) {
		cleanup = effect.onStop = () => {
			fn();
		};
	};
	function getter() {
		if (cleanup) cleanup();
		source(oncleanup);
	}
	const effect = new ReactiveEffect(getter, () => {
		queuePreFlushCb(job);
	});

	effect.run();

	return () => {
		effect.stop();
	};
}
