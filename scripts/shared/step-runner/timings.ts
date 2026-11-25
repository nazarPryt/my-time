export type Timings = Record<string, number>

// Durations of the last passing run, keyed by step name; drives the ETA.
export async function readTimings(file: string): Promise<Timings> {
	try {
		return await Bun.file(file).json()
	} catch {
		return {}
	}
}

export async function writeTimings(file: string, timings: Timings) {
	await Bun.write(file, JSON.stringify(timings, null, '\t')).catch(
		() => undefined,
	)
}
