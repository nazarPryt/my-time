import type { Subprocess } from 'bun'

export type Env = Record<string, string | undefined>

export type OutputStream = 'stdout' | 'stderr'
export type OutputHandler = (chunk: Uint8Array, stream: OutputStream) => void

// Discard, pass through to the terminal, or hand every chunk to a callback.
export type Output = 'ignore' | 'inherit' | OutputHandler

// Runs one command at a time and remembers it, so an interrupt can stop it.
export class ProcessRunner {
	#current: Subprocess | undefined

	constructor(private readonly env: Env) {}

	async run(
		command: string[],
		cwd: string,
		output: Output = 'ignore',
	): Promise<number> {
		const onOutput = typeof output === 'function' ? output : undefined
		const mode = onOutput ? 'pipe' : (output as 'ignore' | 'inherit')
		const child = Bun.spawn(command, {
			cwd,
			env: this.env,
			stdin: mode === 'inherit' ? 'inherit' : 'ignore',
			stdout: mode,
			stderr: mode,
		})
		this.#current = child
		try {
			if (!onOutput) return await child.exited
			const [code] = await Promise.all([
				child.exited,
				forward(child.stdout as ReadableStream<Uint8Array>, (chunk) =>
					onOutput(chunk, 'stdout'),
				),
				forward(child.stderr as ReadableStream<Uint8Array>, (chunk) =>
					onOutput(chunk, 'stderr'),
				),
			])
			return code
		} finally {
			this.#current = undefined
		}
	}

	async succeeds(command: string[], cwd: string): Promise<boolean> {
		return (await this.run(command, cwd)) === 0
	}

	stop(signal: NodeJS.Signals = 'SIGTERM') {
		this.#current?.kill(signal)
	}
}

async function forward(
	stream: ReadableStream<Uint8Array>,
	onChunk: (chunk: Uint8Array) => void,
) {
	for await (const chunk of stream) onChunk(chunk)
}
