import { StyleSheet, Text, View } from 'react-native'

interface HeroCardProps {
	total: number
	targetReps: number
}

export function HeroCard({ total, targetReps }: HeroCardProps) {
	const pct = Math.min((total / targetReps) * 100, 100)
	const left = Math.max(targetReps - total, 0)

	return (
		<View style={styles.card}>
			<Text style={styles.label}>Push-ups today</Text>
			<Text style={styles.counter}>{total}</Text>
			<View style={styles.barTrack}>
				<View style={[styles.barFill, { width: `${pct}%` }]} />
			</View>
			<View style={styles.meta}>
				<Text style={styles.metaText}>
					{total >= targetReps ? 'Goal reached ✓' : `${left} left`}
				</Text>
				<Text style={styles.metaText}>@ {targetReps}</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#1e293b',
		borderRadius: 16,
		padding: 24,
		alignItems: 'center',
		gap: 16,
	},
	label: {
		fontSize: 10,
		fontWeight: '600',
		letterSpacing: 1.6,
		textTransform: 'uppercase',
		color: '#475569',
	},
	counter: {
		fontSize: 80,
		fontWeight: '800',
		color: '#f1f5f9',
		lineHeight: 88,
	},
	barTrack: {
		width: '100%',
		height: 6,
		backgroundColor: '#334155',
		borderRadius: 3,
		overflow: 'hidden',
	},
	barFill: {
		height: '100%',
		backgroundColor: '#6366f1',
		borderRadius: 3,
	},
	meta: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	metaText: {
		fontSize: 12,
		color: '#64748b',
	},
})
