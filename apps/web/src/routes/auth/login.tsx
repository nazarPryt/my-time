import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { AuthShell } from '@/components/auth-shell'
import { Button, Input, Label } from '@/components/ui'
import { useLogin } from '@/feature/auth/login'

export const Route = createFileRoute('/auth/login')({
	component: LoginPage,
})

function LoginPage() {
	const { form, onSubmit } = useLogin()
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = form

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
						data-testid="login-register-link"
					>
						Sign up
					</Link>
				</>
			}
		>
			<form
				data-testid="login-form"
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-5"
			>
				{/* Email */}
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						data-testid="login-email"
						type="email"
						autoComplete="email"
						placeholder="you@example.com"
						aria-invalid={!!errors.email}
						{...register('email')}
					/>
					{errors.email && (
						<p
							data-testid="login-email-error"
							className="text-xs text-destructive"
						>
							{errors.email.message}
						</p>
					)}
				</div>

				{/* Password */}
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center justify-between">
						<Label htmlFor="password">Password</Label>
						<button
							type="button"
							className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
						>
							Forgot password?
						</button>
					</div>
					<Input
						id="password"
						data-testid="login-password"
						type="password"
						autoComplete="current-password"
						placeholder="••••••••"
						aria-invalid={!!errors.password}
						{...register('password')}
					/>
					{errors.password && (
						<p
							data-testid="login-password-error"
							className="text-xs text-destructive"
						>
							{errors.password.message}
						</p>
					)}
				</div>

				{/* Submit */}
				<div>
					<Button
						data-testid="login-submit"
						type="submit"
						className="w-full gap-2"
						size="lg"
						isLoading={isSubmitting}
					>
						Sign in
						<ArrowRight className="size-4" />
					</Button>
				</div>
			</form>
		</AuthShell>
	)
}
