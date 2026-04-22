# Mobile Workout Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Workout tab to the mobile app's protected tab navigator that mirrors the web workout screen — hero counter, quick-add buttons, and sets log.

**Architecture:** A pure UI layer over the already-wired `useWorkoutStore` hook from `apps/mobile/feature/workout/index.ts`. Four focused components assembled in `WorkoutScreen.tsx`, rendered by an Expo Router route file. No new business logic — all state comes from the shared Zustand store.

**Tech Stack:** React Native (View, Text, Pressable, ScrollView, Alert, ActivityIndicator), Expo Router (Tabs), date-fns, StyleSheet

---

## File Map

| Action | Path | Purpose |
|---|---|---|
| Modify | `apps/mobile/app/(protected)/_layout.tsx` | Add Workout tab entry |
| Create | `apps/mobile/app/(protected)/workout.tsx` | Expo Router route → renders WorkoutScreen |
| Create | `apps/mobile/feature/workout/ui/HeroCard.tsx` | Counter + progress bar + read-only goal |
| Create | `apps/mobile/feature/workout/ui/QuickAddButtons.tsx` | +5 / +10 / +15 / +20 pressable row |
| Create | `apps/mobile/feature/workout/ui/SetsLog.tsx` | Sets list with delete + reset |
| Create | `apps/mobile/feature/workout/ui/WorkoutScreen.tsx` | Scrollable container, wires store to sub-components |

---

## Task 1: Add the Workout tab to navigation and create the route stub

**Files:**
- Modify: `apps/mobile/app/(protected)/_layout.tsx`
- Create: `apps/mobile/app/(protected)/workout.tsx`

- [ ] **Step 1: Add Workout tab to `_layout.tsx`**

Open `apps/mobile/app/(protected)/_layout.tsx`. Add a second `<Tabs.Screen>` entry after the existing Dashboard screen:

```tsx
import { Redirect, Tabs } from 'expo-router'
import { useAuth } from '@/shared/lib/auth-context'

export default function ProtectedLayout() {
	const { isAuthenticated, isLoading } = useAuth()

	if (!isLoading && !isAuthenticated) {
		return <Redirect href="/(auth)/login" />
	}

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: { backgroundColor: '#1e293b', borderTopColor: '#334155' },
				tabBarActiveTintColor: '#6366f1',
				tabBarInactiveTintColor: '#64748b',
			}}
		>
			<Tabs.Screen
				name="index"
				options={{ title: 'Dashboard', tabBarLabel: 'Dashboard' }}
			/>
			<Tabs.Screen
				name="workout"
				options={{ title: 'Workout', tabBarLabel: 'Workout' }}
			/>
		</Tabs>
	)
}
```

- [ ] **Step 2: Create route stub `apps/mobile/app/(protected)/workout.tsx`**

```tsx
import { WorkoutScreen } from '@/feature/workout/ui/WorkoutScreen'

export default function WorkoutRoute() {
	return <WorkoutScreen />
}
```

- [ ] **Step 3: Create empty `WorkoutScreen` so the app compiles**

Create `apps/mobile/feature/workout/ui/WorkoutScreen.tsx`:

```tsx
import { Text, View } from 'react-native'

export function WorkoutScreen() {
	return (
		<View style={{ flex: 1, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center' }}>
			<Text style={{ color: '#64748b' }}>Workout coming soon</Text>
		</View>
	)
}
```

- [ ] **Step 4: Verify the tab appears**

Start the app with `bun run start` from `apps/mobile/`. Navigate to the Workout tab — it should show "Workout coming soon". No errors in the Metro output.

- [ ] **Step 5: Commit**

```bash
git add apps/mobile/app/\(protected\)/_layout.tsx apps/mobile/app/\(protected\)/workout.tsx apps/mobile/feature/workout/ui/WorkoutScreen.tsx
git commit -m "feat(mobile): add Workout tab with route stub"
```

---

## Task 2: HeroCard component

**Files:**
- Create: `apps/mobile/feature/workout/ui/HeroCard.tsx`

The HeroCard displays the daily rep count, a progress bar, and read-only goal info.

- [ ] **Step 1: Create `apps/mobile/feature/workout/ui/HeroCard.tsx`**

```tsx
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
```

- [ ] **Step 2: Smoke-test HeroCard in WorkoutScreen**

Temporarily update `WorkoutScreen.tsx` to render the card with hardcoded props:

```tsx
import { ScrollView } from 'react-native'
import { HeroCard } from './HeroCard'

export function WorkoutScreen() {
	return (
		<ScrollView style={{ flex: 1, backgroundColor: '#0f172a' }} contentContainerStyle={{ padding: 16, gap: 12 }}>
			<HeroCard total={60} targetReps={100} />
		</ScrollView>
	)
}
```

Start/reload the app. The Workout tab should show the hero card with "60", a partial progress bar, and "40 left / @ 100".

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/feature/workout/ui/HeroCard.tsx apps/mobile/feature/workout/ui/WorkoutScreen.tsx
git commit -m "feat(mobile): add HeroCard component"
```

---

## Task 3: QuickAddButtons component

**Files:**
- Create: `apps/mobile/feature/workout/ui/QuickAddButtons.tsx`

Four pressable buttons in a row: +5, +10, +15, +20.

- [ ] **Step 1: Create `apps/mobile/feature/workout/ui/QuickAddButtons.tsx`**

```tsx
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
```

- [ ] **Step 2: Add to WorkoutScreen smoke test**

Update `WorkoutScreen.tsx`:

```tsx
import { ScrollView } from 'react-native'
import { HeroCard } from './HeroCard'
import { QuickAddButtons } from './QuickAddButtons'

export function WorkoutScreen() {
	return (
		<ScrollView style={{ flex: 1, backgroundColor: '#0f172a' }} contentContainerStyle={{ padding: 16, gap: 12 }}>
			<HeroCard total={60} targetReps={100} />
			<QuickAddButtons onAdd={(n) => console.log('add', n)} />
		</ScrollView>
	)
}
```

Verify all 4 buttons appear in the tab. Tapping them logs to Metro console.

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/feature/workout/ui/QuickAddButtons.tsx apps/mobile/feature/workout/ui/WorkoutScreen.tsx
git commit -m "feat(mobile): add QuickAddButtons component"
```

---

## Task 4: SetsLog component

**Files:**
- Create: `apps/mobile/feature/workout/ui/SetsLog.tsx`

Scrollable list of today's sets. Trash tap → `Alert.alert` confirm → delete. Reset day → `Alert.alert` confirm → reset.

- [ ] **Step 1: Create `apps/mobile/feature/workout/ui/SetsLog.tsx`**

```tsx
import type { SetResponse } from 'contracts'
import { format } from 'date-fns'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

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
			<ScrollView scrollEnabled={false}>
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
			</ScrollView>
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
```

- [ ] **Step 2: Add to WorkoutScreen smoke test**

Update `WorkoutScreen.tsx` with hardcoded sets:

```tsx
import { ScrollView } from 'react-native'
import { HeroCard } from './HeroCard'
import { QuickAddButtons } from './QuickAddButtons'
import { SetsLog } from './SetsLog'

const FAKE_SETS = [
	{ id: '1', exerciseType: 'pushups' as const, reps: 15, createdAt: new Date(Date.now() - 10 * 60000).toISOString() },
	{ id: '2', exerciseType: 'pushups' as const, reps: 10, createdAt: new Date(Date.now() - 20 * 60000).toISOString() },
]

export function WorkoutScreen() {
	return (
		<ScrollView style={{ flex: 1, backgroundColor: '#0f172a' }} contentContainerStyle={{ padding: 16, gap: 12 }}>
			<HeroCard total={60} targetReps={100} />
			<QuickAddButtons onAdd={(n) => console.log('add', n)} />
			<SetsLog sets={FAKE_SETS} onDelete={(id) => console.log('delete', id)} onReset={() => console.log('reset')} />
		</ScrollView>
	)
}
```

Verify the sets log renders. Tap trash — alert appears with Cancel/Delete. Tap Reset day — alert appears.

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/feature/workout/ui/SetsLog.tsx apps/mobile/feature/workout/ui/WorkoutScreen.tsx
git commit -m "feat(mobile): add SetsLog component with confirmation alerts"
```

---

## Task 5: Wire store into WorkoutScreen

**Files:**
- Replace: `apps/mobile/feature/workout/ui/WorkoutScreen.tsx`

Connect `useWorkoutStore` to the three sub-components. Remove hardcoded data.

- [ ] **Step 1: Replace `WorkoutScreen.tsx` with live store wiring**

```tsx
import { format } from 'date-fns'
import { useEffect } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
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
		<ScrollView
			style={styles.scroll}
			contentContainerStyle={styles.content}
		>
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
```

- [ ] **Step 2: Verify end-to-end**

With the API running (`bun run api:dev` from the monorepo root), open the Workout tab on the mobile app. Verify:
- Loading spinner appears briefly, then real data loads
- Tapping +5/+10/+15/+20 adds a set and the counter updates immediately (optimistic)
- Tapping trash on a set shows the alert; confirming removes it
- Tapping Reset day shows the alert; confirming clears all sets and the counter resets
- Empty state (flame icon) shows when no sets exist

- [ ] **Step 3: Commit**

```bash
git add apps/mobile/feature/workout/ui/WorkoutScreen.tsx
git commit -m "feat(mobile): wire useWorkoutStore into WorkoutScreen"
```

---

## Final commit message for the whole feature

```
feat(mobile): add Workout tab with hero counter, quick-add, and sets log
```
