import { createFileRoute } from '@tanstack/react-router'
import { SiteBlockingPage } from '@/pages/site-blocking'

export const Route = createFileRoute('/dashboard/site-blocking')({
	component: SiteBlockingPage,
})
