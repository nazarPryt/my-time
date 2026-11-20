import { XIcon } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import type * as React from 'react'
import { cn } from '@/shared/lib/cn.ts'

function Dialog({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogContent({
	className,
	children,
	closeTestId,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
	closeTestId?: string
}) {
	return (
		<DialogPrimitive.Portal data-slot="dialog-portal">
			<DialogPrimitive.Overlay
				data-slot="dialog-overlay"
				className="bg-black/10 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 z-50"
			/>
			<DialogPrimitive.Content
				data-slot="dialog-content"
				className={cn(
					'bg-background ring-foreground/10 fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl p-6 ring-1 outline-none',
					className,
				)}
				{...props}
			>
				{children}
				<DialogPrimitive.Close
					data-slot="dialog-close"
					data-testid={closeTestId}
					className="text-muted-foreground hover:text-foreground absolute top-4 right-4 rounded-sm transition-colors"
				>
					<XIcon className="size-4" />
					<span className="sr-only">Close</span>
				</DialogPrimitive.Close>
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	)
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="dialog-header"
			className={cn('grid gap-1.5 pr-6', className)}
			{...props}
		/>
	)
}

function DialogTitle({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cn('text-lg font-medium', className)}
			{...props}
		/>
	)
}

function DialogDescription({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn('text-muted-foreground text-sm', className)}
			{...props}
		/>
	)
}

export {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
}
