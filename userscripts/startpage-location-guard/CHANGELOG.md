# Changelog

All notable changes to **Startpage Location Guard** are documented here.

## 0.1.0 – 2026-08-10

Initial release candidate.

- Detects the presence of Startpage's `locationPref` Search Location cookie.
- Arms only after a non-empty Search Location has been observed.
- Persists armed state through userscript-manager storage, independently of Startpage site data.
- Warns prominently when a previously observed Search Location disappears.
- Provides direct access to Startpage Settings.
- Allows monitoring to be intentionally disabled.
- Uses no network requests, telemetry, dependencies or background polling.
- Publishes stable `@downloadURL` and `@updateURL` metadata pointing to the `main` branch release URL.
