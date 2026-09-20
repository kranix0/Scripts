# Changelog

Notable changes to **ChatGPT Return = Newline** are recorded here.

## 1.0.0 — 2026-09-20

### Added

- Restores plain Enter/Return as a newline for the newer ChatGPT composer UI observed on 20 September 2026.
- Intercepts only trusted, unmodified Enter keypresses inside the ChatGPT composer.
- Reuses ChatGPT's existing Shift+Enter newline behaviour instead of editing ProseMirror content directly.
- Leaves modified shortcuts such as Shift+Enter, Cmd+Enter, Ctrl+Enter and Option/Alt+Enter to ChatGPT.
- Adds stable `@downloadURL` and `@updateURL` metadata for direct installation and automatic updates.
- Adds `@homepageURL`, `@supportURL` and `@noframes` metadata.

### Verified

- Plain Return inserts a newline instead of sending on the affected ChatGPT UI.
- Verified with Vivaldi and AdGuard Desktop on macOS.

### Intentionally out of scope

- Restoring modified-click or native link semantics for the New Chat control.
- Other ChatGPT UI customisation.
