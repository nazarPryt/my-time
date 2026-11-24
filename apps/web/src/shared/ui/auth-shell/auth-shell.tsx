import { BrandPanel } from './brand-panel'
import { FormPanel, type FormPanelProps } from './form-panel'

export function AuthShell(props: FormPanelProps) {
	return (
		<div className="min-h-screen flex flex-col lg:flex-row">
			<BrandPanel />
			<FormPanel {...props} />
		</div>
	)
}
