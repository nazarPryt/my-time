<script setup lang="ts">
import QuizIcon from '../../../../shared/ui/quiz-icon.vue'

defineProps<{ answer: string }>()
const emit = defineEmits<{ next: [] }>()
</script>

<template>
	<div class="correct-answer" role="status">
		<p class="correct-answer-sentence">{{ answer }}</p>
		<span class="correct-answer-badge">
			<QuizIcon name="check" :size="40" />
			<span class="visually-hidden">Correct</span>
		</span>
		<button type="button" class="btn btn-primary correct-answer-next" @click="emit('next')">
			Next
		</button>
	</div>
</template>
