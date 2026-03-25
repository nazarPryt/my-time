import type * as React from 'react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface ConfirmDialogProps {
	trigger: React.ReactNode
	title: string
	description?: React.ReactNode
	confirmLabel?: string
	cancelLabel?: string
	variant?: 'default' | 'destructive'
	onConfirm: () => void
}

export function ConfirmDialog({
	trigger,
	title,
	description,
	confirmLabel = 'Confirm',
	cancelLabel = 'Cancel',
	variant = 'default',
	onConfirm,
}: ConfirmDialogProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription
						className={description ? undefined : 'sr-only'}
					>
						{description ?? title}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
					<AlertDialogAction variant={variant} onClick={onConfirm}>
						{confirmLabel}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
