import { Pressable, StyleSheet, Text, View } from 'react-native'

const QUICK_ADD = [5, 10, 15, 20] as const

interface QuickAddButtonsProps {
	onAdd: (reps: number) => void
	disabled?: boolean
}

export function QuickAddButtons({ onAdd, disabled }: QuickAddButtonsProps) {
	return (
		<View style={styles.row}>
			{QUICK_ADD.map((n) => (
				<Pressable
					key={n}
					style={({ pressed }) => [
						styles.button,
						pressed && styles.buttonPressed,
						disabled && styles.buttonDisabled,
					]}
					onPress={() => onAdd(n)}
					disabled={disabled}
				>
					<Text style={styles.plus}>+</Text>
					<Text style={styles.number}>{n}</Text>
				</Pressable>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		gap: 8,
	},
	button: {
		flex: 1,
		backgroundColor: '#1e293b',
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 2,
	},
	buttonPressed: {
		opacity: 0.7,
		transform: [{ scale: 0.96 }],
	},
	buttonDisabled: {
		opacity: 0.4,
	},
	plus: {
		fontSize: 11,
		color: '#64748b',
		lineHeight: 14,
	},
	number: {
		fontSize: 22,
		fontWeight: '700',
		color: '#f1f5f9',
		lineHeight: 26,
	},
})
