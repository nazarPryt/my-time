import { useRef, useState } from 'react'
import { clearSiteBlocking } from '@/bll/siteBlocking/siteBlockingService'
import { useAuth } from '@/features/auth/useAuth'
import { useSiteBlocking } from '@/features/siteBlocking/useSiteBlocking'
import { EXTENSION_CONFIG } from '@/shared/config/extension-config'

function App() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	// syncRef lets useAuth.onLoginSuccess call the sync function from
	// useSiteBlocking without a circular hook dependency.
	const syncRef = useRef<() => Promise<void>>(async () => {})

	const { status, loginError, submitting, handleLogin, handleLogout } = useAuth(
		() => void syncRef.current(),
	)

	const { blockedCount, syncing, sync } = useSiteBlocking(
		status === 'authenticated',
	)
	// Keep the ref current on every render
	syncRef.current = sync

	async function onLoginSubmit(e: React.FormEvent) {
		e.preventDefault()
		await handleLogin(email, password)
	}

	async function onSignOut() {
		await clearSiteBlocking()
		await handleLogout()
		setEmail('')
		setPassword('')
	}

	if (status === 'loading') {
		return (
			<div className="popup">
				<p className="popup-subtitle">Loading…</p>
			</div>
		)
	}

	if (status === 'unauthenticated') {
		return (
			<div className="popup">
				<div>
					<p className="popup-title">my·time</p>
					<p className="popup-subtitle">Sign in to enable site blocking</p>
				</div>
				<form
					onSubmit={onLoginSubmit}
					style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
				>
					<input
						data-testid="extension-email"
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						disabled={submitting}
					/>
					<input
						data-testid="extension-password"
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						disabled={submitting}
					/>
					{loginError && <p className="error">{loginError}</p>}
					<button
						data-testid="extension-login"
						type="submit"
						className="btn btn-primary"
						disabled={submitting}
					>
						{submitting ? 'Signing in…' : 'Sign In'}
					</button>
				</form>
			</div>
		)
	}

	return (
		<div className="popup">
			<p className="popup-title">my·time — Site Blocking</p>

			<div className="stat">
				<span className="stat-label">Sites blocked</span>
				<span data-testid="extension-blocked-count" className="stat-value">
					{blockedCount ?? '—'}
				</span>
			</div>

			<div className="divider" />

			<div className="actions">
				<button
					type="button"
					className="btn btn-primary"
					data-testid="extension-sync"
					onClick={sync}
					disabled={syncing}
				>
					{syncing ? 'Syncing…' : 'Sync now'}
				</button>
				<button
					type="button"
					className="btn btn-secondary"
					onClick={() =>
						browser.tabs.create({
							url: EXTENSION_CONFIG.SITE_BLOCKING_PAGE_URL,
						})
					}
				>
					Manage in dashboard
				</button>
				<button
					data-testid="extension-signout"
					type="button"
					className="btn btn-ghost"
					onClick={onSignOut}
				>
					Sign out
				</button>
			</div>
		</div>
	)
}

export default App
