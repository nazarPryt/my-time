/**
 * Puts `item` back at `index` (clamped to the list) — the undo for an
 * optimistic removal. Unlike restoring a snapshot, it keeps anything added
 * to the list while the removal was in flight. No-op if the item (matched by
 * `id`) is already present.
 */
export function reinsertAt<T extends { id: string }>(
	list: readonly T[],
	item: T,
	index: number,
): T[] {
	if (list.some((existing) => existing.id === item.id)) return [...list]
	const at = Math.min(Math.max(index, 0), list.length)
	return [...list.slice(0, at), item, ...list.slice(at)]
}
