import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { AuthShell } from '@/components/auth-shell'
import { Button, Input, Label } from '@/components/ui'
import { useRegister } from '@/feature/auth/register'
import { AUTH_TEST_IDS } from '@/feature/auth/testIds'

export const Route = createFileRoute('/auth/register')({
	component: RegisterPage,
})

function RegisterPage() {
	const { form, onSubmit } = useRegister()
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = form

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
			<form
				data-testid={AUTH_TEST_IDS.register.form}
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-5"
			>
				{/* Name */}
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="name">Full name</Label>
					<Input
						id="name"
						data-testid={AUTH_TEST_IDS.register.name}
						type="text"
						autoComplete="name"
						placeholder="Alex Johnson"
						aria-invalid={!!errors.name}
						{...register('name')}
					/>
					{errors.name && (
						<p
							data-testid={AUTH_TEST_IDS.register.nameError}
							className="text-xs text-destructive"
						>
							{errors.name.message}
						</p>
					)}
				</div>

				{/* Email */}
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						data-testid={AUTH_TEST_IDS.register.email}
						type="email"
						autoComplete="email"
						placeholder="you@example.com"
						aria-invalid={!!errors.email}
						{...register('email')}
					/>
					{errors.email && (
						<p
							data-testid={AUTH_TEST_IDS.register.emailError}
							className="text-xs text-destructive"
						>
							{errors.email.message}
						</p>
					)}
				</div>

				{/* Password */}
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						data-testid={AUTH_TEST_IDS.register.password}
						type="password"
						autoComplete="new-password"
						placeholder="At least 4 characters"
						aria-invalid={!!errors.password}
						{...register('password')}
					/>
					{errors.password ? (
						<p
							data-testid={AUTH_TEST_IDS.register.passwordError}
							className="text-xs text-destructive"
						>
							{errors.password.message}
						</p>
					) : (
						<p className="text-xs text-muted-foreground">
							Minimum 4 characters
						</p>
					)}
				</div>

				{/* Submit */}
				<div>
					<Button
						data-testid={AUTH_TEST_IDS.register.submit}
						type="submit"
						className="w-full gap-2"
						size="lg"
						isLoading={isSubmitting}
					>
						Create account
						<ArrowRight className="size-4" />
					</Button>
				</div>
			</form>
		</AuthShell>
	)
}
