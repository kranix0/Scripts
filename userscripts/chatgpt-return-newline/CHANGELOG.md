# Changelog

Notable changes to **ChatGPT Return = Newline** are recorded here.

## 1.1.0 — 2026-09-22

### Added

- Restores **Cmd+Enter** on macOS and **Ctrl+Enter** on Windows/Linux as Send.
- Supports the newer `#prompt-textarea` / `form[data-type="unified-composer"]` variant observed on 22 September 2026.
- Retains selectors for the earlier 20 September composer variant so users in different rollout cohorts are not forced onto one DOM assumption.
- Uses the composer's standard `requestSubmit()` path for sending rather than depending on a transient Send button.

### Changed

- Documentation now distinguishes the independently changing newline and send-shortcut behaviours.
- Compatibility notes describe the multiple observed UI variants and the disappearance of the previous keyboard-shortcut settings screen on the 22 September variant.

## 1.0.0 — 2026-09-20

### Added

- Restores plain Enter/Return as a newline for the newer ChatGPT composer UI observed on 20 September 2026.
- Intercepts only trusted, unmodified Enter keypresses inside the ChatGPT composer.
- Reuses ChatGPT's existing Shift+Enter newline behaviour instead of editing ProseMirror content directly.
- Adds stable `@downloadURL` and `@updateURL` metadata for direct installation and automatic updates.
- Adds `@homepageURL`, `@supportURL` and `@noframes` metadata.

### Verified

- Plain Return inserts a newline instead of sending on the affected ChatGPT UI.
- Verified with Vivaldi and AdGuard Desktop on macOS.

### Intentionally out of scope

- Restoring modified-click or native link semantics for the New Chat control.
- Other ChatGPT UI customisation.
