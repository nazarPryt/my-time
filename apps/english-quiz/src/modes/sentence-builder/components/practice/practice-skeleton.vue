<script setup lang="ts">
import SkeletonBlock from '../../../../shared/ui/skeleton-block.vue'
import SkeletonStatus from '../../../../shared/ui/skeleton-status.vue'
import { TILES_PER_STEP } from '../../model/word-tiles'
</script>

<template>
	<SkeletonStatus>
		<div class="topic-practice">
			<div class="sentence-exercise">
				<SkeletonBlock width="16rem" height="1.5rem" />
				<SkeletonBlock width="20rem" height="3rem" />
				<div class="practice-skeleton-tiles">
					<SkeletonBlock
						v-for="tile in TILES_PER_STEP"
						:key="tile"
						height="4rem"
					/>
				</div>
			</div>
		</div>
	</SkeletonStatus>
</template>
