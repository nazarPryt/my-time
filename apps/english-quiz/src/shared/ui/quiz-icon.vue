<script setup lang="ts">
// Inline SVG icons (lucide paths) so the remote needs no icon dependency.
const ICON_PATHS = {
	'arrow-left': ['m12 19-7-7 7-7', 'M19 12H5'],
	backspace: [
		'M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z',
		'm12 9 6 6',
		'm18 9-6 6',
	],
	book: [
		'M12 7v14',
		'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z',
	],
	check: ['M20 6 9 17l-5-5'],
	'chevron-right': ['m9 18 6-6-6-6'],
	retry: ['M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8', 'M3 3v5h5'],
} as const

export type QuizIconName = keyof typeof ICON_PATHS

const { name, size = 18 } = defineProps<{
	name: QuizIconName
	size?: number
}>()
</script>

<template>
	<svg
		class="quiz-icon"
		:width="size"
		:height="size"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path v-for="path in ICON_PATHS[name]" :key="path" :d="path" />
	</svg>
</template>
