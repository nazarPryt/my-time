import { createFileRoute } from '@tanstack/react-router'
import { PermessoStatusPage } from '@/pages/permesso-status'

export const Route = createFileRoute('/dashboard/permesso-status')({
	component: PermessoStatusPage,
})
