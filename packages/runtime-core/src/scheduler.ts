const queue: any[] = [];
const activePreFlushCbs: any[] = [];
let isFlushPending = false;
const p = Promise.resolve();
export function queueJobs(job) {
	if (!queue.includes(job)) {
		queue.push(job);
	}
	queueFlush();
}

export function nextTick(fn?) {
	return fn ? p.then(fn) : p;
}

function queueFlush() {
	if (isFlushPending) return;
	isFlushPending = true;
	nextTick(flushJobs);
}

function flushJobs() {
	isFlushPending = false;

	flushPrevFlushCbs();

	let job;
	while ((job = queue.shift())) {
		job && job();
	}
}

function flushPrevFlushCbs() {
	for (let i = 0; i < activePreFlushCbs.length; i++) {
		activePreFlushCbs[i]();
	}
}

export function queuePreFlushCb(cb) {
	activePreFlushCbs.push(cb);
	queueFlush();
}
