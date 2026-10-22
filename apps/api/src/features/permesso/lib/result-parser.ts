/** Runs in the browser: keep this function independent of server-side imports. */
export function extractPermessoStatus(container: Element): string {
	const message = container.cloneNode(true) as Element
	// The result link repeats the practice number; icons and scripts are not status text.
	for (const element of message.querySelectorAll(
		'a, .glyphicon, script, style',
	)) {
		element.remove()
	}
	for (const br of message.querySelectorAll('br')) {
		br.replaceWith(' ')
	}
	// textContent does not insert the visual separators between block elements.
	for (const block of message.querySelectorAll(
		'p, div, li, section, article',
	)) {
		block.prepend(' ')
		block.append(' ')
	}
	return (message.textContent ?? '').replace(/\s+/g, ' ').trim()
}
