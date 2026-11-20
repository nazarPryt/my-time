<script setup lang="ts">
import { computed } from 'vue'
import type { ProgressDot } from '../../model/topic-practice'

const { dots } = defineProps<{ dots: readonly ProgressDot[] }>()

const DOT_LABELS: Record<ProgressDot, string> = {
	'first-try': 'correct',
	'after-mistakes': 'correct after mistakes',
	current: 'current',
	upcoming: 'not started',
}

const items = computed(() =>
	dots.map((state, index) => ({
		state,
		label: `Sentence ${index + 1}: ${DOT_LABELS[state]}`,
	})),
)
</script>

<template>
	<ol class="progress-dots" aria-label="Progress">
		<li
			v-for="(item, index) in items"
			:key="index"
			class="progress-dot"
			:data-state="item.state"
			:aria-label="item.label"
		/>
	</ol>
</template>
