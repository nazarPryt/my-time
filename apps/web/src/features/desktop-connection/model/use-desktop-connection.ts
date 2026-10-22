import { useEffect, useState } from 'react'
import {
	approveDesktopRequest,
	loadDesktopRequest,
} from '../api/desktop-pairing'

export function useDesktopConnection(
	requestId: string,
	onApproved: () => void,
) {
	const [request, setRequest] = useState<{
		confirmationCode: string
		email: string
	} | null>(null)
	const [error, setError] = useState('')
	const [busy, setBusy] = useState(false)
	const [approved, setApproved] = useState(false)
	useEffect(() => {
		let active = true
		setRequest(null)
		setApproved(false)
		setError('')
		void loadDesktopRequest(requestId).then(
			(result) => {
				if (active) setRequest(result)
			},
			() => {
				if (active)
					setError(
						'This connection request expired. Start again from desktop Settings.',
					)
			},
		)
		return () => {
			active = false
		}
	}, [requestId])

	async function connect() {
		if (busy || approved) return
		setBusy(true)
		setError('')
		try {
			await approveDesktopRequest(requestId)
			setApproved(true)
			onApproved()
		} catch {
			setError('Unable to connect. Start again from desktop Settings.')
		} finally {
			setBusy(false)
		}
	}

	return { request, error, busy, approved, connect }
}
