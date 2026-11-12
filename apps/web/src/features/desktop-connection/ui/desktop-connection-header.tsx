import { CardDescription, CardHeader, CardTitle } from '@/shared/ui'

export function DesktopConnectionHeader({ approved }: { approved: boolean }) {
	return (
		<CardHeader>
			<CardTitle>
				{approved ? 'Desktop connection approved' : 'Connect your desktop'}
			</CardTitle>
			<CardDescription>
				{approved
					? 'Your desktop will sign in automatically. No further action is needed.'
					: 'Use your signed-in my·time account on your desktop.'}
			</CardDescription>
		</CardHeader>
	)
}
