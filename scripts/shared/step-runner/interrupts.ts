// The shell convention: 128 + signal number.
export function signalExitCode(signal: NodeJS.Signals): number {
	return signal === 'SIGTERM' ? 143 : 130
}

// Remembers the first SIGINT/SIGTERM; later signals are ignored so cleanup can finish.
export class InterruptGuard {
	#signal: NodeJS.Signals | undefined

	constructor(onInterrupt: (signal: NodeJS.Signals) => void) {
		for (const signal of ['SIGINT', 'SIGTERM'] as const) {
			process.on(signal, () => {
				if (this.#signal) return
				this.#signal = signal
				onInterrupt(signal)
			})
		}
	}

	get signal(): NodeJS.Signals | undefined {
		return this.#signal
	}

	get interrupted(): boolean {
		return this.#signal !== undefined
	}

	exitCode(fallback: number): number {
		return this.#signal ? signalExitCode(this.#signal) : fallback
	}
}
