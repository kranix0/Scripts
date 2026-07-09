# 1-Click Cancel Amazon S&S

A one-click userscript for cancelling visible Amazon Subscribe & Save subscriptions on the current auto-deliveries page.

## Status

Beta: `0.4.0-beta-1`

This beta is current-page only. Pagination and multi-page cancellation are intentionally out of scope.

The maintainer currently has no active Subscribe & Save subscriptions, so live cancellation has not yet been personally verified against active items.

## What it does

- Adds a floating button to Amazon Subscribe & Save pages.
- Shows the number of visible S&S subscriptions found on the current page.
- Cancels only the visible subscriptions listed in the button label.
- Uses the current Amazon marketplace origin, so it can work across supported Amazon domains.
- Reports per-item success/failure after running.

## Safety model

The button is the confirmation. If it says `Cancel 3 visible S&S`, clicking it attempts to cancel those 3 visible items.

## Install

Install the `.user.js` file with a userscript manager such as AdGuard, Tampermonkey or Violentmonkey.

## Attribution

The core cancellation mechanism is adapted from [L422Y’s Amazon Subscribe & Save gist](https://gist.github.com/L422Y/53b75be4bb8afd5cd6143e74150cc142). Used with permission; attribution/link required.
