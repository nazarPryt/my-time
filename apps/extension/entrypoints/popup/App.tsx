import { useEffect, useState } from 'react'
import { login } from '../../utils/api'
import { clearTokens, getTokens, setTokens } from '../../utils/auth'

const WEB_APP_URL = import.meta.env.VITE_WEB_URL ?? 'http://localhost:5173'

type View = 'loading' | 'login' | 'dashboard'

function App() {
	const [view, setView] = useState<View>('loading')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loginError, setLoginError] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const [blockedCount, setBlockedCount] = useState<number | null>(null)
	const [syncing, setSyncing] = useState(false)

	useEffect(() => {
		getTokens().then((tokens) => {
			setView(tokens ? 'dashboard' : 'login')
		})
	}, [])

	useEffect(() => {
		if (view === 'dashboard') {
			browser.storage.local.get('blocked_sites').then((result) => {
				const sites = result.blocked_sites as unknown[]
				setBlockedCount(Array.isArray(sites) ? sites.length : 0)
			})
		}
	}, [view])

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault()
		setSubmitting(true)
		setLoginError('')
		const { data, error } = await login(email, password)
		if (error || !data) {
			setLoginError('Invalid email or password')
			setSubmitting(false)
			return
		}
		await setTokens(data.accessToken, data.refreshToken)
		setSubmitting(false)
		setView('dashboard')
		void handleSync()
	}

	async function handleSync() {
		setSyncing(true)
		const response = await browser.runtime.sendMessage({ type: 'SYNC' })
		const count = (response as { count?: number })?.count ?? 0
		setBlockedCount(count)
		setSyncing(false)
	}

	async function handleSignOut() {
		await clearTokens()
		await chrome.declarativeNetRequest.updateDynamicRules({
			removeRuleIds: (await chrome.declarativeNetRequest.getDynamicRules()).map(
				(r) => r.id,
			),
			addRules: [],
		})
		await browser.storage.local.remove('blocked_sites')
		setView('login')
		setEmail('')
		setPassword('')
		setBlockedCount(null)
	}

	if (view === 'loading') {
		return (
			<div className="popup">
				<p className="popup-subtitle">Loading…</p>
			</div>
		)
	}

	if (view === 'login') {
		return (
			<div className="popup">
				<div>
					<p className="popup-title">my·time</p>
					<p className="popup-subtitle">Sign in to enable site blocking</p>
				</div>
				<form
					onSubmit={handleLogin}
					style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
				>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						disabled={submitting}
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						disabled={submitting}
					/>
					{loginError && <p className="error">{loginError}</p>}
					<button
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
				<span className="stat-value">{blockedCount ?? '—'}</span>
			</div>

			<div className="divider" />

			<div className="actions">
				<button
					type="button"
					className="btn btn-primary"
					onClick={handleSync}
					disabled={syncing}
				>
					{syncing ? 'Syncing…' : 'Sync now'}
				</button>
				<button
					type="button"
					className="btn btn-secondary"
					onClick={() =>
						chrome.tabs.create({
							url: `${WEB_APP_URL}/dashboard/site-blocking`,
						})
					}
				>
					Manage in dashboard
				</button>
				<button type="button" className="btn btn-ghost" onClick={handleSignOut}>
					Sign out
				</button>
			</div>
		</div>
	)
}

export default App
