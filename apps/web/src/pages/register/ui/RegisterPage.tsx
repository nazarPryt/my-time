import { Link } from '@tanstack/react-router'
import { RegisterForm } from '@/features/auth/register'
import { AUTH_TEST_IDS } from '@/features/auth/shared/testIds'
import { AuthShell } from '@/shared/ui/auth-shell'

export function RegisterPage() {
	return (
		<AuthShell
			title="Create an account"
			description="Start tracking your time in under a minute."
			footer={
				<>
					Already have an account?{' '}
					<Link
						to="/auth/login"
						className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
						data-testid={AUTH_TEST_IDS.register.loginLink}
					>
						Sign in
					</Link>
				</>
			}
		>
			<RegisterForm />
		</AuthShell>
	)
}
