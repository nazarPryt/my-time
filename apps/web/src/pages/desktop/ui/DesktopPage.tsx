import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/ui'
import { DESKTOP_SETUP_TEST_IDS as DS } from '../testIds'
import { DesktopExtensionCard } from './DesktopExtensionCard'

export function DesktopPage() {
	return (
		<div className="mx-auto w-full max-w-3xl space-y-6">
			<Button asChild variant="ghost" size="sm">
				<Link to="/dashboard/time-tracker" data-testid={DS.back}>
					<ArrowLeft aria-hidden="true" /> Back to time tracker
				</Link>
			</Button>
			<DesktopExtensionCard />
		</div>
	)
}
