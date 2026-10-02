// Compares dotted numeric versions ("0.2.0", "1.10.3") part by part, the same
// format Chrome requires for extension manifest versions. Missing parts count
// as 0, so "1.2" equals "1.2.0".
export function isOlderVersion(installed: string, latest: string): boolean {
	const a = installed.split('.').map(Number)
	const b = latest.split('.').map(Number)
	for (let i = 0; i < Math.max(a.length, b.length); i++) {
		const diff = (a[i] ?? 0) - (b[i] ?? 0)
		if (diff !== 0) return diff < 0
	}
	return false
}
