import { Dialog as SheetPrimitive, VisuallyHidden } from 'radix-ui'
import type * as React from 'react'
import { cn } from '@/shared/lib/cn.ts'

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
	return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
	...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
	return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
	...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
	return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
	...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
	return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
	className,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
	return (
		<SheetPrimitive.Overlay
			data-slot="sheet-overlay"
			className={cn(
				'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 fixed inset-0 z-50 bg-black/40 duration-150',
				className,
			)}
			{...props}
		/>
	)
}

const sideClasses = {
	left: 'inset-y-0 left-0 h-full w-72 max-w-[80vw] border-r data-closed:slide-out-to-left data-open:slide-in-from-left',
	right:
		'inset-y-0 right-0 h-full w-72 max-w-[80vw] border-l data-closed:slide-out-to-right data-open:slide-in-from-right',
} as const

function SheetContent({
	className,
	side = 'left',
	title,
	description,
	children,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
	side?: keyof typeof sideClasses
	title: string
	description?: string
}) {
	return (
		<SheetPortal>
			<SheetOverlay />
			<SheetPrimitive.Content
				data-slot="sheet-content"
				className={cn(
					'data-open:animate-in data-closed:animate-out fixed z-50 flex flex-col bg-sidebar border-sidebar-border shadow-lg duration-200 outline-none',
					sideClasses[side],
					className,
				)}
				{...props}
			>
				<VisuallyHidden.Root>
					<SheetPrimitive.Title>{title}</SheetPrimitive.Title>
					{description ? (
						<SheetPrimitive.Description>
							{description}
						</SheetPrimitive.Description>
					) : null}
				</VisuallyHidden.Root>
				{children}
			</SheetPrimitive.Content>
		</SheetPortal>
	)
}

export {
	Sheet,
	SheetTrigger,
	SheetClose,
	SheetPortal,
	SheetOverlay,
	SheetContent,
}
