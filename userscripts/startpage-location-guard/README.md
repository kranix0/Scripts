# Startpage Location Guard

A small userscript that makes Startpage's Search Location failure visible instead of silent.

## Purpose

Startpage can silently forget your saved Search Location. This script warns you when that happens, so you know your search results may no longer be localised the way you expect.

## Status

Current version: **0.1.0**

The script is deliberately narrow: it does not change Startpage settings, extend cookie lifetimes, alter search requests or send data anywhere.

See [`CHANGELOG.md`](./CHANGELOG.md) for release history.

## Why this exists

Startpage stores Search Location locally in a `locationPref` cookie. In testing, that cookie was given an expiry roughly three months after the setting was saved, and ordinary searches did not refresh the expiry. Search Location is also not represented by Startpage's portable Settings URL.

That means a previously configured location can eventually disappear while Startpage continues working normally. For location-sensitive searches, the change can be easy to miss.

This userscript provides a simple trust boundary: if this browser previously had a Search Location and that preference later disappears, Startpage displays a prominent warning.

## What it does

- Watches only Startpage pages.
- Detects the non-HttpOnly `locationPref` cookie.
- Arms itself after observing a non-empty Search Location at least once.
- Stores that armed state in the userscript manager rather than Startpage site storage.
- Shows a persistent warning if the browser was armed and `locationPref` is later missing.
- Provides an **Open Settings** link to restore the preference.
- Provides **Stop monitoring** for people who intentionally stop using Search Location.
- Remains invisible while Search Location is present.

## Why the armed state is separate

A simple implementation could remember prior use in Startpage's `localStorage`. That would fail if Startpage site data were cleared, because the cookie and the guard's memory could disappear together.

Instead, this script uses the userscript manager's `GM_getValue` / `GM_setValue` storage. The guard therefore retains its memory independently of Startpage's cookies and local storage.

## Installation

Install a compatible userscript manager. AdGuard Desktop for macOS, Windows and Android can act as a userscript manager, as can browser-based managers such as Tampermonkey and Violentmonkey.

Then install the userscript from this stable URL:

<https://raw.githubusercontent.com/kranix0/Scripts/main/userscripts/startpage-location-guard/startpage-location-guard.user.js>

In AdGuard for Mac:

1. Open **AdGuard → Settings → Extensions**.
2. Add/import an extension from a URL.
3. Paste the stable URL above and install it.

The userscript contains `@updateURL` and `@downloadURL` metadata pointing to the same `main`-branch raw URL. When a newer version is published there, compatible userscript managers can discover it through their normal update mechanism.

## Usage

There is normally nothing to do.

### Normal state

If Startpage has a non-empty `locationPref` cookie, the script remembers that Search Location is in use and stays invisible.

### Location disappears

If the preference later disappears, a red warning appears at the top of Startpage:

> **Startpage Search Location is no longer set. Localised search results may differ.**

Use **Open Settings** to restore Search Location.

### Intentionally stop using Search Location

Choose **Stop monitoring** in the warning. This disarms the guard. It will automatically arm again if a Search Location is configured later.

## Privacy and resource use

The script:

- makes no network requests;
- has no telemetry;
- has no dependencies;
- does not poll in the background;
- does not inspect search queries or results;
- does not read the value of `locationPref` beyond checking whether it is present and non-empty;
- stores one boolean value in the userscript manager.

## Limitations

- It detects a missing `locationPref` cookie; it cannot read the cookie's expiry date through `document.cookie`.
- It cannot guarantee that the location value itself is semantically correct. It verifies presence, not correctness.
- It relies on Startpage continuing to use the `locationPref` cookie for Search Location. If Startpage changes that implementation, the script may warn until it is updated.
- A userscript manager must inject the script on Startpage pages. If the manager or AdGuard filtering is disabled for Startpage, the guard cannot run.

## Stable update contract

The public install/update endpoint is:

`https://raw.githubusercontent.com/kranix0/Scripts/main/userscripts/startpage-location-guard/startpage-location-guard.user.js`

`main` is the release channel. Development work should happen on branches; the version number in the userscript metadata should be increased before a release is merged to `main`.

This keeps installed clients pointed at one durable URL while allowing development without silently changing the release script.

## Licence

This userscript is original work maintained by Sridhar Dhanapalan and is provided under the repository's [MIT Licence](../../LICENSE).
