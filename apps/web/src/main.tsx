import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import { installGlobalErrorReporting } from '@/shared/lib/error-reporting'
import { ErrorBoundary } from '@/shared/ui/error-boundary'
import { routeTree } from './app/routeTree.gen'
import './index.css'

installGlobalErrorReporting()

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
