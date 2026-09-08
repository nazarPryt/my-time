import { api } from '@/shared/lib/api'

export async function fetchPermessoStatus() {
	return api.permesso.get()
}

export async function setPermessoPracticeNumber(practiceNumber: string) {
	return api.permesso.put({ practiceNumber })
}

export async function runPermessoCheck() {
	return api.permesso.check.post()
}

export async function updatePermessoCheckHours(checkHours: number[]) {
	return api.permesso.schedule.put({ checkHours })
}

export async function fetchPermessoHistory() {
	return api.permesso.history.get()
}

export async function createPermessoTelegramLink() {
	return api.permesso.telegram.link.post()
}

export async function disconnectPermessoTelegram() {
	return api.permesso.telegram.disconnect.post()
}
