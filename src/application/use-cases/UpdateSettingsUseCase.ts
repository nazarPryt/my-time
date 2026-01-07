import type { ISettingsRepository } from '@domain/interfaces'
import type { UserSettings, PartialUserSettings } from '@shared/schemas'

export interface UpdateSettingsInput {
  userId: string
  updates: PartialUserSettings
}

export interface UpdateSettingsOutput {
  settings: UserSettings
}

/**
 * Use Case: Update Settings
 *
 * Updates user settings with partial updates.
 * Validates the updates and merges them with existing settings.
 */
export class UpdateSettingsUseCase {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async execute(input: UpdateSettingsInput): Promise<UpdateSettingsOutput> {
    // Get existing settings (creates defaults if not exists)
    const existingSettings = await this.settingsRepository.getSettings(input.userId)

    // Update settings with partial updates
    const updatedSettings = await this.settingsRepository.updateSettings(input.userId, input.updates)

    return { settings: updatedSettings }
  }
}
