# Extension Layer

**Chrome Extension Specific Code**

This layer contains Chrome extension-specific entry points and configuration.

## Structure

- **background/**: Service worker (background script)
- **popup/**: Popup entry point and configuration
- **options/**: Options page entry point

## Principles

- Extension-specific code only
- Entry points for different extension contexts
- Message passing between contexts
- Chrome API integrations

## Extension Contexts

1. **Background**: Service worker for persistent state and alarms
2. **Popup**: Main UI when clicking extension icon
3. **Options**: Full settings page opened in new tab
