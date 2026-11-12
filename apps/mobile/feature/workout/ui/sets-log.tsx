import type { SetResponse } from 'contracts'
import { format } from 'date-fns'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'

interface SetsLogProps {
	sets: SetResponse[]
	onDelete: (id: string) => void
	onReset: () => void
}

export function SetsLog({ sets, onDelete, onReset }: SetsLogProps) {
	function confirmDelete(id: string) {
		Alert.alert('Delete set?', 'This set will be permanently removed.', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Delete', style: 'destructive', onPress: () => onDelete(id) },
		])
	}

	function confirmReset() {
		Alert.alert(
			'Reset day?',
			`All ${sets.length} set${sets.length !== 1 ? 's' : ''} will be permanently deleted.`,
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Reset', style: 'destructive', onPress: onReset },
			],
		)
	}

	if (sets.length === 0) {
		return (
			<View style={styles.empty}>
				<Text style={styles.emptyIcon}>🔥</Text>
				<Text style={styles.emptyText}>No sets yet. Start pushing.</Text>
			</View>
		)
	}

	return (
		<View style={styles.card}>
			<View style={styles.header}>
				<Text style={styles.headerLabel}>Sets · {sets.length}</Text>
				<Pressable onPress={confirmReset}>
					<Text style={styles.resetText}>↺ Reset day</Text>
				</Pressable>
			</View>
			{[...sets].reverse().map((set, index) => (
				<View
					key={set.id}
					style={[styles.row, index < sets.length - 1 && styles.rowBorder]}
				>
					<Text style={styles.time}>
						{format(new Date(set.createdAt), 'HH:mm')}
					</Text>
					<View style={styles.rowRight}>
						<Text style={styles.reps}>+{set.reps}</Text>
						<Pressable onPress={() => confirmDelete(set.id)} hitSlop={8}>
							<Text style={styles.trash}>🗑</Text>
						</Pressable>
					</View>
				</View>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	empty: {
		alignItems: 'center',
		paddingVertical: 40,
		gap: 8,
	},
	emptyIcon: {
		fontSize: 24,
		opacity: 0.3,
	},
	emptyText: {
		fontSize: 13,
		color: '#475569',
	},
	card: {
		backgroundColor: '#1e293b',
		borderRadius: 16,
		overflow: 'hidden',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#334155',
	},
	headerLabel: {
		fontSize: 10,
		fontWeight: '600',
		letterSpacing: 1.2,
		textTransform: 'uppercase',
		color: '#475569',
	},
	resetText: {
		fontSize: 12,
		color: '#ef4444',
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 13,
	},
	rowBorder: {
		borderBottomWidth: 1,
		borderBottomColor: '#334155',
	},
	time: {
		fontSize: 13,
		color: '#64748b',
	},
	rowRight: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 14,
	},
	reps: {
		fontSize: 15,
		fontWeight: '700',
		color: '#6366f1',
	},
	trash: {
		fontSize: 15,
		color: '#475569',
	},
})
