import { ArrowRight } from 'lucide-react'
import { Button, Input, Label } from '@/shared/ui'
import { AUTH_TEST_IDS } from '../../shared/testIds'
import { useLogin } from '../model/useLogin'

export function LoginForm() {
	const { form, onSubmit } = useLogin()
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = form

	return (
		<form
			data-testid={AUTH_TEST_IDS.login.form}
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-5"
		>
			{/* Email */}
			<div className="flex flex-col gap-1.5">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					data-testid={AUTH_TEST_IDS.login.email}
					type="email"
					autoComplete="email"
					placeholder="you@example.com"
					aria-invalid={!!errors.email}
					{...register('email')}
				/>
				{errors.email && (
					<p
						data-testid={AUTH_TEST_IDS.login.emailError}
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
					data-testid={AUTH_TEST_IDS.login.password}
					type="password"
					autoComplete="current-password"
					placeholder="••••••••"
					aria-invalid={!!errors.password}
					{...register('password')}
				/>
				{errors.password && (
					<p
						data-testid={AUTH_TEST_IDS.login.passwordError}
						className="text-xs text-destructive"
					>
						{errors.password.message}
					</p>
				)}
			</div>

			{/* Submit */}
			<div>
				<Button
					data-testid={AUTH_TEST_IDS.login.submit}
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
	)
}
