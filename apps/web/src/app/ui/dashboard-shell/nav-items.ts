import type { LinkProps } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
	Dumbbell,
	FileCheck2,
	Home,
	Languages,
	Settings,
	ShieldOff,
	Timer,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { ExtensionUpdateDot } from '@/features/site-blocking'
import { DASHBOARD_TEST_IDS } from '@/shared/ui/test-ids'

export type NavItemType = {
	to: LinkProps['to']
	label: string
	icon: LucideIcon
	exact: boolean
	testId: string
	// Optional status marker rendered at the end of the nav item (e.g. a dot)
	indicator?: ComponentType
}

export const NAV_ITEMS: NavItemType[] = [
	{
		to: '/dashboard',
		label: 'Home',
		icon: Home,
		exact: true,
		testId: DASHBOARD_TEST_IDS.navLink('home'),
	},
	{
		to: '/dashboard/workout',
		label: 'Workout',
		icon: Dumbbell,
		exact: false,
		testId: DASHBOARD_TEST_IDS.navLink('workout'),
	},
	{
		to: '/dashboard/time-tracker',
		label: 'Time tracker',
		icon: Timer,
		exact: false,
		testId: DASHBOARD_TEST_IDS.navLink('time-tracker'),
	},
	{
		to: '/dashboard/site-blocking',
		label: 'Site Blocking',
		icon: ShieldOff,
		exact: false,
		testId: DASHBOARD_TEST_IDS.navLink('site-blocking'),
		indicator: ExtensionUpdateDot,
	},
	{
		to: '/dashboard/permesso-status',
		label: 'Permesso Status',
		icon: FileCheck2,
		exact: false,
		testId: DASHBOARD_TEST_IDS.navLink('permesso-status'),
	},
	{
		to: '/dashboard/english-quiz',
		label: 'English Quiz',
		icon: Languages,
		exact: false,
		testId: DASHBOARD_TEST_IDS.navLink('english-quiz'),
	},
	{
		to: '/dashboard/settings',
		label: 'Settings',
		icon: Settings,
		exact: false,
		testId: DASHBOARD_TEST_IDS.navLink('settings'),
	},
] as const
