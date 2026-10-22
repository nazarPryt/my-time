import GLib from 'gi://GLib'

export class RetryDelay {
	private source = 0
	private resolve: (() => void) | undefined
	private disposed = false

	wait(milliseconds: number): Promise<void> {
		if (this.disposed) return Promise.resolve()
		return new Promise((resolve) => {
			this.resolve = resolve
			this.source = GLib.timeout_add(
				GLib.PRIORITY_DEFAULT,
				milliseconds,
				() => {
					this.source = 0
					this.resolve = undefined
					resolve()
					return GLib.SOURCE_REMOVE
				},
			)
		})
	}

	dispose(): void {
		this.disposed = true
		if (this.source) GLib.Source.remove(this.source)
		this.source = 0
		this.resolve?.()
		this.resolve = undefined
	}
}
