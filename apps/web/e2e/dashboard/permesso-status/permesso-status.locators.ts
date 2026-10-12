import { PERMESSO_TEST_IDS } from '@/features/permesso/testIds'
import { SHARED_TEST_IDS } from '@/shared/ui/testIds'
import { BaseLocators } from '../BaseLocators'

export class PermessoStatusLocators extends BaseLocators {
	get root() {
		return this.page.getByTestId(PERMESSO_TEST_IDS.page)
	}
	get loading() {
		return this.root.getByTestId(PERMESSO_TEST_IDS.loading)
	}
	get error() {
		return this.root.getByTestId(PERMESSO_TEST_IDS.error)
	}
	get practiceInput() {
		return this.root.getByTestId(PERMESSO_TEST_IDS.practiceInput)
	}
	get practiceSave() {
		return this.root.getByTestId(PERMESSO_TEST_IDS.practiceSave)
	}
	get practiceError() {
		return this.root.getByTestId(PERMESSO_TEST_IDS.practiceError)
	}
	get checkButton() {
		return this.root.getByTestId(PERMESSO_TEST_IDS.check)
	}
	get status() {
		return this.root.getByTestId(PERMESSO_TEST_IDS.status)
	}
	get historyRows() {
		return this.root.getByTestId(PERMESSO_TEST_IDS.historyRow)
	}
	get historyEmpty() {
		return this.root.getByTestId(PERMESSO_TEST_IDS.historyEmpty)
	}
	get schedule() {
		return this.root.getByTestId(PERMESSO_TEST_IDS.schedule)
	}
	hour(hour: number) {
		return this.root.getByTestId(PERMESSO_TEST_IDS.hour(hour))
	}
	get telegramConnect() {
		return this.root.getByTestId(PERMESSO_TEST_IDS.telegramConnect)
	}
	get telegramDisconnect() {
		return this.root.getByTestId(PERMESSO_TEST_IDS.telegramDisconnect)
	}
	get telegramStatus() {
		return this.root.getByTestId(PERMESSO_TEST_IDS.telegramStatus)
	}
	get telegramPending() {
		return this.root.getByTestId(PERMESSO_TEST_IDS.telegramPending)
	}
	get telegramError() {
		return this.root.getByTestId(PERMESSO_TEST_IDS.telegramError)
	}
	get finalResetDialog() {
		return this.page.getByTestId(PERMESSO_TEST_IDS.resetFinalDialog)
	}
	get finalResetConfirm() {
		return this.finalResetDialog.getByTestId(
			SHARED_TEST_IDS.confirmDialog.confirm,
		)
	}
	get finalResetCancel() {
		return this.finalResetDialog.getByTestId(
			SHARED_TEST_IDS.confirmDialog.cancel,
		)
	}
	get resetButton() {
		return this.root.getByTestId(PERMESSO_TEST_IDS.reset)
	}
}
