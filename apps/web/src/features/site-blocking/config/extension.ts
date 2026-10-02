// Browsers block links to chrome:// pages from websites, so the setup and
// update guides show this address with a copy button instead.
export const CHROME_EXTENSIONS_PAGE = 'chrome://extensions'

// How long to wait for the content script to answer a ping before deciding
// the extension isn't installed. It answers in a few ms when present.
export const PING_TIMEOUT_MS = 300

// Connecting round-trips through the extension's background worker and the
// API, so it gets far more slack than a ping.
export const CONNECT_TIMEOUT_MS = 5000
