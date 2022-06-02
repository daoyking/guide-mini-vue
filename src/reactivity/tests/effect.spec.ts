import { reactive } from "../reactive"
import { effect, stop } from "../effect"

describe("effect", () => {
	it("happy path", () => {
		const user: any = reactive({
			age: 10,
		})

		let nextAge: any
		effect(() => {
			nextAge = user.age + 1
		})

		expect(nextAge).toBe(11)

		// update
		user.age++
		expect(nextAge).toBe(12)
	})

	it("should return runner when call effect", () => {
		let foo = 10
		const runner = effect(() => {
			foo++
			return "foo"
		})
		expect(foo).toBe(11)
		const r = runner()
		expect(foo).toBe(12)
		expect(r).toBe("foo")
	})

	it("scheduler", () => {
		let dummy
		let run
		const scheduler = jest.fn(() => {
			run = runner
		})
		const obj = reactive({ foo: 1 })
		const runner = effect(
			() => {
				dummy = obj.foo
			},
			{ scheduler }
		)

		expect(scheduler).not.toHaveBeenCalled()

		expect(dummy).toBe(1)

		obj.foo++

		expect(scheduler).toHaveBeenCalledTimes(1)

		expect(dummy).toBe(1)

		run()

		expect(dummy).toBe(2)
	})

	it("stop", () => {
		let dummy
		const obj = reactive({ a: 1 })
		const runner = effect(() => {
			dummy = obj.a
		})
		obj.a = 2
		expect(dummy).toBe(2)
		stop(runner)
		obj.a = 3
		expect(dummy).toBe(2)

		runner()
		expect(dummy).toBe(3)
	})

	it("onStop", () => {
		const obj = reactive({ foo: 1 })

		const onStop = jest.fn()

		let dummy

		const runner = effect(
			() => {
				dummy = obj.foo
			},
			{ onStop }
		)

		stop(runner)

		expect(onStop).toBeCalledTimes(1)
	})
})
