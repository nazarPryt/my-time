<script setup lang="ts">
defineProps<{ score: number; total: number }>()
const emit = defineEmits<{ restart: []; back: [] }>()
</script>

<template>
	<div class="topic-complete">
		<p class="muted">Topic complete</p>
		<p class="topic-complete-score" aria-label="Sentences right on the first try">
			{{ score }} / {{ total }}
		</p>
		<p class="muted">sentences right on the first try</p>
		<div class="row">
			<button type="button" class="btn btn-primary" @click="emit('restart')">Practice again</button>
			<button type="button" class="btn" @click="emit('back')">Back to topics</button>
		</div>
	</div>
</template>
