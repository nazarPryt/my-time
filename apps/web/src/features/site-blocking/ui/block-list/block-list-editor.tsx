import { useEffect } from 'react'
import { useSiteBlockingActions, useSiteBlockingState } from '../../model/store'
import { SITE_BLOCKING_TEST_IDS as SB } from '../../testIds'
import { AddSiteForm } from './add-site-form'
import { SiteList } from './site-list'

/** The user's block list: add form, last error, and the list itself. */
export function BlockListEditor() {
	const { sites, loading, submitting, error } = useSiteBlockingState()
	const { loadSites, addSite, removeSite } = useSiteBlockingActions()

	useEffect(() => {
		void loadSites()
	}, [loadSites])

	return (
		<>
			<AddSiteForm submitting={submitting} onAdd={addSite} />

			{error && (
				<p className="text-sm text-destructive" data-testid={SB.error}>
					{error}
				</p>
			)}

			<div className="rounded-xl border border-border bg-card overflow-hidden">
				<SiteList sites={sites} loading={loading} onRemove={removeSite} />
			</div>
		</>
	)
}
