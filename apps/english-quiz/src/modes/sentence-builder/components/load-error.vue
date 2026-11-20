<script setup lang="ts">
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
	<div class="load-error" role="alert">
		<p class="muted">Could not load this content.</p>
		<button type="button" class="btn btn-sm" @click="emit('retry')">
			Try again
		</button>
	</div>
</template>
