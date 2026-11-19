export const SITE_BLOCKING_TEST_IDS = {
	// Page shell
	page: 'site-blocking-page',
	statusBadge: 'sb-status-badge',

	// Add form
	addForm: 'sb-add-form',
	domainInput: 'sb-domain-input',
	addBtn: 'sb-add-btn',
	error: 'sb-error',

	// Site list
	listLoading: 'sb-list-loading',
	listEmpty: 'sb-list-empty',
	siteList: 'sb-site-list',
	siteRow: 'sb-site-row',
	siteFavicon: 'sb-site-favicon',
	siteDomain: 'sb-site-domain',
	siteAddedAt: 'sb-site-added-at',
	siteRemoveTrigger: 'sb-site-remove-trigger',

	// Setup card
	setupCard: 'sb-setup-card',
	installStep: 'sb-install-step',
	connectStep: 'sb-connect-step',
	stepDone: 'sb-step-done',
	downloadLink: 'sb-download-link',
	storeLink: 'sb-store-link',
	reloadBtn: 'sb-reload-btn',
	connectBtn: 'sb-connect-btn',
	connectError: 'sb-connect-error',

	// Update card
	updateCard: 'sb-update-card',
	updateDescription: 'sb-update-description',
	updateDownloadLink: 'sb-update-download-link',

	// Copy-to-clipboard chrome://extensions chip (rendered in both cards)
	copyableUrl: 'sb-copyable-url',
	copyableUrlCopied: 'sb-copyable-url-copied',

	// Sidebar nav indicator
	updateDot: 'sb-update-dot',
} as const
