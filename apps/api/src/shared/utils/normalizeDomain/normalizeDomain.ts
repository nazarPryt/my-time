export function normalizeDomain(input: string): string {
	// Strip protocol, www, paths, and lowercase
	return input
		.toLowerCase()
		.replace(/^https?:\/\//, '')
		.replace(/^www\./, '')
		.split('/')[0]
		.split('?')[0]
}
