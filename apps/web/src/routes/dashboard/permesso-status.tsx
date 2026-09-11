import { createFileRoute } from '@tanstack/react-router'
import { PermessoStatusWidget } from '@/feature/permesso'

export const Route = createFileRoute('/dashboard/permesso-status')({
	component: PermessoStatusPage,
})

function PermessoStatusPage() {
	return <PermessoStatusWidget />
}
