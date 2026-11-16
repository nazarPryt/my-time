<script setup lang="ts">
import { QUIZ_LEVELS } from '@my-time/mfe-contracts'
import SkeletonBlock from '../../../shared/ui/skeleton-block.vue'
import SkeletonStatus from '../../../shared/ui/skeleton-status.vue'
</script>

<template>
	<SkeletonStatus class="level-quiz">
		<section class="card stack">
			<div class="stack-sm">
				<SkeletonBlock width="10rem" height="1.25rem" />
				<SkeletonBlock height="0.875rem" />
				<SkeletonBlock width="60%" height="0.875rem" />
			</div>
			<div class="levels">
				<SkeletonBlock
					v-for="level in QUIZ_LEVELS"
					:key="level"
					height="4rem"
				/>
			</div>
			<SkeletonBlock height="2.5rem" />
		</section>
	</SkeletonStatus>
</template>
