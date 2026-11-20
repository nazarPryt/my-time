import {
	ENGLISH_QUIZ_REMOTE,
	type EnglishQuizProps,
} from '@my-time/micro-frontends'
import { WEB_CONFIG } from '@/shared/config/web-config'
import { loadRemoteModule } from '@/shared/lib/micro-frontends'

export function loadEnglishQuiz() {
	return loadRemoteModule<EnglishQuizProps>(
		ENGLISH_QUIZ_REMOTE,
		WEB_CONFIG.ENGLISH_QUIZ_ENTRY,
	)
}
