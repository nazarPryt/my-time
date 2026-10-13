import { DESKTOP_EXTENSION_DOWNLOAD_FILENAME } from 'contracts'
import { Download, Monitor } from 'lucide-react'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/ui'
import { DESKTOP_SETUP_TEST_IDS as DC } from '../testIds'

export function DesktopExtensionCard() {
	return (
		<Card data-testid={DC.setupCard}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Monitor
						className="size-5 text-muted-foreground"
						aria-hidden="true"
					/>
					Track from your desktop
				</CardTitle>
				<CardDescription>
					Start and stop work from your desktop panel, even with your browser
					closed. The my·time GNOME extension uses the same account and syncs
					with this tracker.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-sm text-muted-foreground">
					For Linux with GNOME Shell 46. Developed for Ubuntu 24.04; other Linux
					distributions, including Arch, need GNOME 46 and the required
					dependencies. Other GNOME versions are not yet supported. Windows,
					macOS, KDE, and other desktops can use the web tracker.
				</p>
				<Button asChild variant="outline">
					<a href={`/${DESKTOP_EXTENSION_DOWNLOAD_FILENAME}`} download>
						<Download aria-hidden="true" />
						Download GNOME extension (.zip)
					</a>
				</Button>
				<details open className="rounded-md border border-border p-4 text-sm">
					<summary className="cursor-pointer font-medium focus-visible:outline-ring">
						How to install and connect
					</summary>
					<ol className="mt-4 list-decimal space-y-3 pl-5 text-muted-foreground">
						<li>
							Check your version with <code>gnome-shell --version</code>. You
							need GNOME 46, GJS, GTK4, libadwaita, Soup 3, and an available,
							unlocked Secret Service keyring.
						</li>
						<li>
							Download the ZIP, then run this command from your Downloads folder
							without unzipping it:
							<pre className="mt-2 overflow-x-auto rounded bg-muted p-3 text-xs text-foreground">
								<code>
									{`gnome-extensions install --force ${DESKTOP_EXTENSION_DOWNLOAD_FILENAME}`}
								</code>
							</pre>
						</li>
						<li>
							Save your work, log out and back in, then enable the extension:
							<pre className="mt-2 overflow-x-auto rounded bg-muted p-3 text-xs text-foreground">
								<code>gnome-extensions enable my-time@my-time.local</code>
							</pre>
						</li>
						<li>
							Click the timer in your desktop panel and open Settings. Choose
							“Sign in with browser”, then click “Connect desktop” on the web
							page. Keep desktop Settings open until connected.
						</li>
					</ol>
				</details>
			</CardContent>
		</Card>
	)
}
