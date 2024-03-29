import { vi } from "vitest";
import { reactive } from "../src/reactive";
import { computed } from "../src/computed";

describe("computed", () => {
	it("happy path", () => {
		const user = reactive({
			age: 1,
		});

		const age = computed(() => {
			return user.age;
		});

		expect(age.value).toBe(1);
	});

	it("should computed lazily", () => {
		const value = reactive({ foo: 1 });
		const getter = vi.fn(() => {
			return value.foo;
		});
		const cValue = computed(getter);

		// lazy
		expect(getter).not.toHaveBeenCalled();

		expect(cValue.value).toBe(1);
		expect(getter).toHaveBeenCalledTimes(1);

		cValue.value;
		expect(getter).toHaveBeenCalledTimes(1);

		value.foo = 2;
		expect(getter).toHaveBeenCalledTimes(1);

		expect(cValue.value).toBe(2);
		expect(getter).toHaveBeenCalledTimes(2);

		cValue.value;
		expect(getter).toHaveBeenCalledTimes(2);
	});
});
