import {
	ENGLISH_QUIZ_CONTRACT_VERSION,
	type EnglishQuizProps,
	type RemoteMount,
} from '@my-time/mfe-contracts'
import { createApp, h, reactive } from 'vue'
import QuizApp from './quiz-app.vue'
import styles from './styles/quiz.css?inline'

/**
 * The module the host loads through Module Federation (`englishQuiz/mount`).
 * See RemoteModule in @my-time/mfe-contracts.
 */
export const contractVersion = ENGLISH_QUIZ_CONTRACT_VERSION

export const mount: RemoteMount<EnglishQuizProps> = (
	container,
	initialProps,
) => {
	// Shadow DOM isolates styles in both directions: the host's Tailwind reset
	// can't restyle the quiz, and the quiz's CSS can't leak into the host.
	// CSS custom properties DO inherit through the boundary, so the quiz
	// still picks up the host's design tokens (and dark mode) for free.
	const shadow =
		container.shadowRoot ?? container.attachShadow({ mode: 'open' })
	const style = document.createElement('style')
	style.textContent = styles
	const root = document.createElement('div')
	shadow.replaceChildren(style, root)

	// Reactive so update() re-renders without losing the quiz's own state.
	const props = reactive({ ...initialProps })

	const app = createApp({
		render: () =>
			h(QuizApp, {
				initialLevel: props.initialLevel ?? 'B1',
				report: (event) => props.onEvent?.(event),
			}),
	})
	app.config.errorHandler = (error) => {
		props.onError?.(error instanceof Error ? error : new Error(String(error)))
	}
	app.mount(root)

	return {
		update(next) {
			Object.assign(props, next)
		},
		unmount() {
			app.unmount()
			shadow.replaceChildren()
		},
	}
}
