import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import { ErrorBoundary } from '@/components/error-boundary'
import { routeTree } from './routeTree.gen'
import './index.css'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

const rootElement = document.getElementById('root')!
ReactDOM.createRoot(rootElement).render(
	<StrictMode>
		<ErrorBoundary>
			<RouterProvider router={router} />
		</ErrorBoundary>
	</StrictMode>,
)
