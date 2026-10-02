import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/ui'
import { type ExtensionStatus, isInstalled } from '../../lib/extension-status'
import { SITE_BLOCKING_TEST_IDS as SB } from '../../testIds'
import { ConnectInstructions } from './connect-instructions'
import { InstallInstructions } from './install-instructions'
import { SetupStep } from './setup-step'

interface ExtensionSetupCardProps {
	status: ExtensionStatus
	connecting: boolean
	connectFailed: boolean
	onConnect: () => void
}

export function ExtensionSetupCard({
	status,
	connecting,
	connectFailed,
	onConnect,
}: ExtensionSetupCardProps) {
	const installed = isInstalled(status)

	return (
		<Card data-testid={SB.setupCard}>
			<CardHeader>
				<CardTitle>Set up site blocking</CardTitle>
				<CardDescription>
					Blocking runs inside your browser through the my·time extension. Your
					list below is saved either way — it starts working once both steps are
					done.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ol className="space-y-5">
					<SetupStep
						number={1}
						done={installed}
						title="Install the extension"
						testId={SB.installStep}
					>
						{!installed && <InstallInstructions />}
					</SetupStep>
					<SetupStep
						number={2}
						done={status === 'linked'}
						disabled={!installed}
						title="Connect it to your account"
						testId={SB.connectStep}
					>
						{installed && (
							<ConnectInstructions
								connecting={connecting}
								connectFailed={connectFailed}
								onConnect={onConnect}
							/>
						)}
					</SetupStep>
				</ol>
			</CardContent>
		</Card>
	)
}
