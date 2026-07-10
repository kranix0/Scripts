# Changelog

Notable changes to **1-Click Cancel Amazon S&S** are recorded here.

## 0.4.2

### Added

- Adds an understated, clickable status mode when no visible Subscribe & Save subscriptions are found.
- Clicking the status button confirms that the userscript is installed and running without making cancellation requests.
- Adds explanatory tooltips for the empty, cancellation-ready and working button states.

### Changed

- Makes button styling explicit for each state so that inactive, ready and working modes remain visually distinct.

The Amazon subscription detection and cancellation request workflow are unchanged.

## 0.4.1

### Changed

- Safely encodes subscription IDs before including them in cancellation request URLs.
- Preserves repeated cancellation-form fields instead of collapsing duplicate field names.
- Validates that Amazon's cancellation form uses the expected `POST` method before submitting it.
- Adopts a stable userscript namespace that is independent of repository paths.
- Moves release history out of the userscript source and into this changelog.

These are defensive reliability improvements. The visible-page-only workflow and user interface are unchanged.

## 0.4.0

### Added

- Floating one-click cancellation button showing the number of visible Subscribe & Save subscriptions.
- Current-page-only cancellation, with pagination and multi-page cancellation intentionally out of scope.
- Support for using the current Amazon marketplace origin rather than a hardcoded `amazon.com` address.
- Request timeouts and per-item success/failure reporting.

### Confirmed

- Successful cancellation of active Subscribe & Save subscriptions was confirmed through user feedback.

### Documentation

- Added installation, usage, safety, marketplace, limitation, licence and provenance documentation.
- Added direct installation and automatic-update URLs.
