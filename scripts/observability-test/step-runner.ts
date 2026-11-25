import {
	lastLine,
	type ProcessRunner,
	type StepState,
} from '../shared/step-runner'

/** What a step can do; output goes to its log file (or the terminal with --plain). */
export interface StepContext {
	log(line: string): void
	/** Runs a command from the repo root; throws when it exits non-zero. */
	run(command: string[]): Promise<void>
	/** Re-runs `check` until it returns true; throws on timeout or Ctrl+C. */
	poll(
		what: string,
		check: () => Promise<boolean>,
		options: { timeoutMs: number; everyMs: number },
	): Promise<void>
}

export interface TestStep {
	name: string
	/** Throws to fail the step; the message ends up last in its log. */
	run(context: StepContext): Promise<void>
}

export function createStepRunner({
	runner,
	root,
	plain,
	logPath,
	isInterrupted,
}: {
	runner: ProcessRunner
	root: string
	plain: boolean
	logPath: (index: number) => string
	isInterrupted: () => boolean
}) {
	return async (step: TestStep, state: StepState, index: number) => {
		const file = plain ? undefined : Bun.file(logPath(index)).writer()
		const write = (text: string) => {
			if (file) file.write(text)
			else process.stdout.write(text)
			state.lastLine = lastLine(text) ?? state.lastLine
		}
		const context: StepContext = {
			log: (line) => write(`${plain ? '  ' : ''}${line}\n`),
			async run(command) {
				write(`$ ${command.join(' ')}\n`)
				// One decoder per stream so a multi-byte character split across chunks survives.
				const decoders = {
					stdout: new TextDecoder(),
					stderr: new TextDecoder(),
				}
				const code = await runner.run(
					command,
					root,
					plain
						? 'inherit'
						: (chunk, stream) =>
								write(decoders[stream].decode(chunk, { stream: true })),
				)
				if (code !== 0) throw new Error(`${command.join(' ')} exited ${code}`)
			},
			async poll(what, check, { timeoutMs, everyMs }) {
				const deadline = Date.now() + timeoutMs
				while (!(await check().catch(() => false))) {
					if (isInterrupted()) throw new Error('Interrupted')
					if (Date.now() > deadline)
						throw new Error(
							`Timed out after ${timeoutMs / 1000}s waiting for ${what}`,
						)
					await Bun.sleep(everyMs)
				}
			},
		}

		if (plain) console.info(`\n> ${step.name}`)
		try {
			await step.run(context)
			return 0
		} catch (error) {
			write(`✗ ${error instanceof Error ? error.message : error}\n`)
			return 1
		} finally {
			await file?.end()
		}
	}
}
