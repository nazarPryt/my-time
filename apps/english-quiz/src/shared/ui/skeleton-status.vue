<script setup lang="ts">
const { label = 'Loading…' } = defineProps<{ label?: string }>()
</script>

<template>
	<div class="skeleton-status" role="status" aria-busy="true">
		<span class="visually-hidden">{{ label }}</span>
		<slot />
	</div>
</template>
