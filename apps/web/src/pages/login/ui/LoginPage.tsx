import { Link } from '@tanstack/react-router'
import { LoginForm } from '@/features/auth/login'
import { AUTH_TEST_IDS } from '@/features/auth/shared/testIds'
import { AuthShell } from '@/shared/ui/auth-shell'

export function LoginPage() {
	return (
		<AuthShell
			title="Welcome back"
			description="Sign in to continue tracking your time."
			footer={
				<>
					Don&apos;t have an account?{' '}
					<Link
						to="/auth/register"
						className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
						data-testid={AUTH_TEST_IDS.login.registerLink}
					>
						Sign up
					</Link>
				</>
			}
		>
			<LoginForm />
		</AuthShell>
	)
}
