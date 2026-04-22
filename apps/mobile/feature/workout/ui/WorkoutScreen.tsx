import { format } from 'date-fns'
import { useEffect } from 'react'
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native'
import { useWorkoutStore } from '@/feature/workout'
import { HeroCard } from './HeroCard'
import { QuickAddButtons } from './QuickAddButtons'
import { SetsLog } from './SetsLog'

export function WorkoutScreen() {
	const { data, loading, submitting, load, addSet, deleteSet, resetDay } =
		useWorkoutStore()

	useEffect(() => {
		const controller = new AbortController()
		void load(controller.signal)
		return () => controller.abort()
	}, [load])

	return (
		<ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>🏋️ Workout</Text>
				<Text style={styles.headerDate}>
					{format(new Date(), 'EEE, MMM d')}
				</Text>
			</View>

			{loading ? (
				<ActivityIndicator color="#6366f1" style={styles.loader} />
			) : (
				<>
					<HeroCard
						total={data?.total ?? 0}
						targetReps={data?.goal.targetReps ?? 100}
					/>
					<QuickAddButtons onAdd={addSet} disabled={submitting} />
					<SetsLog
						sets={data?.sets ?? []}
						onDelete={deleteSet}
						onReset={resetDay}
					/>
				</>
			)}
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	scroll: {
		flex: 1,
		backgroundColor: '#0f172a',
	},
	content: {
		padding: 16,
		gap: 12,
		paddingBottom: 40,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 8,
	},
	headerTitle: {
		fontSize: 17,
		fontWeight: '600',
		color: '#f1f5f9',
	},
	headerDate: {
		fontSize: 13,
		color: '#64748b',
	},
	loader: {
		marginTop: 60,
	},
})
