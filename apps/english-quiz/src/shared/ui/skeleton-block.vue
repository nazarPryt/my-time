<script setup lang="ts">
const {
	width = '100%',
	height = '1rem',
	shape = 'rect',
} = defineProps<{
	width?: string
	height?: string
	shape?: 'rect' | 'pill'
}>()
</script>

<template>
	<span
		class="skeleton-block"
		:data-shape="shape"
		:style="{ width, height }"
		aria-hidden="true"
	/>
</template>
