import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/test/error')({
	component: () => {
		throw new Error('Test render error')
	},
})
