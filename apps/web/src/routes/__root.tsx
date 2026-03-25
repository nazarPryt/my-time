import {
	createRootRoute,
	Link,
	Outlet,
	useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ErrorScreen } from '@/components/error-boundary'
import { NotFoundScreen } from '@/components/not-found-screen'

export const Route = createRootRoute({
	component: RootLayout,
	errorComponent: ({ error, reset }) => (
		<ErrorScreen
			error={error instanceof Error ? error : undefined}
			onReset={reset}
		/>
	),
	notFoundComponent: () => <NotFoundScreen />,
})

function RootLayout() {
	const pathname = useRouterState({ select: (s) => s.location.pathname })
	const isAuthRoute = pathname.startsWith('/auth')
	const isDashboardRoute = pathname.startsWith('/dashboard')

	if (isAuthRoute || isDashboardRoute) {
		return (
			<>
				<Outlet />
				<TanStackRouterDevtools />
			</>
		)
	}

	return (
		<>
			<nav className="flex gap-4 p-4 border-b">
				<Link to="/" className="[&.active]:font-bold hover:underline">
					Home
				</Link>
				<Link to="/auth/login" className="[&.active]:font-bold hover:underline">
					Login
				</Link>
				<Link
					to="/auth/register"
					className="[&.active]:font-bold hover:underline"
				>
					Register
				</Link>
			</nav>
			<main className="p-4">
				<Outlet />
			</main>
			<TanStackRouterDevtools />
		</>
	)
}
