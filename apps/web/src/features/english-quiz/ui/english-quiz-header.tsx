import { Languages } from 'lucide-react'
import { ENGLISH_QUIZ_TEST_IDS } from '../test-ids'

export function EnglishQuizHeader() {
	return (
		<header
			data-testid={ENGLISH_QUIZ_TEST_IDS.header}
			className="h-14 flex items-center px-4 sm:px-8 border-b border-border shrink-0 gap-2.5"
		>
			<Languages
				size={15}
				strokeWidth={1.75}
				className="text-muted-foreground"
			/>
			<h1 className="text-sm font-semibold text-foreground tracking-tight">
				English quiz
			</h1>
			<span className="ml-auto text-xs text-muted-foreground">
				Micro frontend · Vue
			</span>
		</header>
	)
}
