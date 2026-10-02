import { zodResolver } from '@hookform/resolvers/zod'
import {
	type CreateBlockedSiteRequest,
	CreateBlockedSiteRequestSchema,
} from 'contracts'
import { useForm } from 'react-hook-form'
import { Button, Input } from '@/shared/ui'
import { SITE_BLOCKING_TEST_IDS as SB } from '../../testIds'

interface AddSiteFormProps {
	submitting: boolean
	onAdd: (domain: string) => Promise<void>
}

export function AddSiteForm({ submitting, onAdd }: AddSiteFormProps) {
	const { register, handleSubmit, reset } = useForm<CreateBlockedSiteRequest>({
		resolver: zodResolver(CreateBlockedSiteRequestSchema),
		defaultValues: { domain: '' },
	})

	// Clears the input whatever the outcome — a failure shows its own error.
	async function submit({ domain }: CreateBlockedSiteRequest) {
		await onAdd(domain)
		reset()
	}

	return (
		<form
			onSubmit={handleSubmit(submit)}
			className="flex gap-2"
			data-testid={SB.addForm}
		>
			<Input
				placeholder="e.g. reddit.com"
				{...register('domain')}
				disabled={submitting}
				className="flex-1"
				data-testid={SB.domainInput}
			/>
			<Button type="submit" disabled={submitting} data-testid={SB.addBtn}>
				Block
			</Button>
		</form>
	)
}
