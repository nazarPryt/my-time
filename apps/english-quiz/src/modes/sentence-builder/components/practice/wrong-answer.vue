<script setup lang="ts">
import QuizIcon from '../../../../shared/ui/quiz-icon.vue'
import type { CheckedWord } from '../../model/sentence-attempt'

defineProps<{ words: readonly CheckedWord[] }>()
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
	<div class="wrong-answer" role="alert">
		<p class="wrong-answer-sentence">
			<template v-for="(word, index) in words" :key="index">
				<span v-if="word.correct">{{ word.before }}{{ word.picked }}{{ word.after }}</span>
				<!-- Punctuation sits beside the slot, on the line of the picked word. -->
				<span v-else class="wrong-answer-item"
					>{{ word.before }}<span class="wrong-answer-slot"
						><ins class="wrong-answer-fix">{{ word.expected }}</ins
						><del class="wrong-answer-word">{{ word.picked }}</del></span
					>{{ word.after }}</span
				>
			</template>
		</p>
		<button type="button" class="btn btn-primary btn-icon" @click="emit('retry')">
			<QuizIcon name="retry" />
			Try again
		</button>
	</div>
</template>
