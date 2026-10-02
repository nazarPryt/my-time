import type { ReactNode } from 'react'

/** Numbered, muted step-by-step list used by the install and update guides. */
export function InstructionList({ children }: { children: ReactNode }) {
	return (
		<ol className="list-decimal space-y-1.5 pl-5 text-muted-foreground marker:text-muted-foreground/60">
			{children}
		</ol>
	)
}

/** Bold UI label inside an instruction, e.g. "Developer mode". */
export function UiLabel({ children }: { children: ReactNode }) {
	return <strong className="text-foreground">{children}</strong>
}
