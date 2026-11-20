<script setup lang="ts">
import QuizIcon from '../../../../shared/ui/quiz-icon.vue'

defineProps<{ words: readonly string[] }>()
const emit = defineEmits<{ undo: [] }>()
</script>

<template>
	<div class="answer-line">
		<p class="answer-line-text" aria-live="polite">
			<template v-if="words.length">{{ words.join(' ') }}</template>
			<span v-else class="answer-line-placeholder">Pick the first word</span>
		</p>
		<button
			v-if="words.length"
			type="button"
			class="icon-button"
			aria-label="Remove last word"
			@click="emit('undo')"
		>
			<QuizIcon name="backspace" :size="20" />
		</button>
	</div>
</template>
