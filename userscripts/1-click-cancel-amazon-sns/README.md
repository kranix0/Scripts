# 1-Click Cancel Amazon S&S

A one-click userscript for cancelling visible Amazon Subscribe & Save subscriptions on the current auto-deliveries page.

## Status

Current version: **0.4.0**

It operates on the current page only. Pagination and automatic multi-page cancellation are intentionally out of scope.

## What it does

- Adds a floating cancellation button to the bottom-right corner of supported Amazon Subscribe & Save pages.
- Shows the number of visible subscriptions detected on the current page.
- Cancels only the subscriptions represented by the number shown on the button.
- Works from the current Amazon marketplace origin rather than relying on a hardcoded `amazon.com` address.
- Works with the main S&S links in Amazon's UI.
- Applies a timeout to each cancellation request.
- Reports per-item successes and failures after the run.

## Safety model

The button label is the confirmation.

For example, clicking:

> **Cancel 3 visible S&S**

attempts to cancel the three visible subscriptions detected on the current page.

There is no additional confirmation dialog, and the operation cannot be undone by this script. Check the button count before clicking it.

## Supported Amazon marketplaces

The script currently runs on Subscribe & Save pages for:

- Australia
- Canada
- France
- Germany
- India
- Italy
- Japan
- Netherlands
- Spain
- United Kingdom
- United States

Amazon can change its pages or cancellation process without notice. Please report any marketplace where the script no longer works as expected.

## Installation

Install a userscript manager such as:

- AdGuard
- Tampermonkey
- Violentmonkey

Then [install the userscript directly](https://raw.githubusercontent.com/kranix0/Scripts/main/userscripts/1-click-cancel-amazon-sns/1-click-cancel-amazon-sns.user.js).

Your userscript manager should recognise the `.user.js` file and offer to install it.

## Usage

1. Open Amazon's **Subscribe & Save** or **Your Auto-Deliveries** page.
2. Confirm that the subscriptions you intend to cancel are visible.
3. Check the number shown on the floating cancellation button.
4. Click the button.
5. Review the success and failure summary.

If Amazon displays subscriptions across multiple pages, repeat the process separately on each page.

## Limitations

- Only subscriptions visible on the current page are processed.
- The script does not navigate through pagination.
- It depends on Amazon's current page structure and cancellation workflow.
- Script is functional as per user feedback. I don't have any subscriptions anymore (thanks to an earlier version of this script!) so I couldn't test myself.

## Licence and attribution

The majority of this userscript is original work maintained by Sridhar Dhanapalan and is provided under the repository's [MIT Licence](../../LICENSE).

The underlying Amazon cancellation mechanism is adapted from [L422Y's Amazon Subscribe & Save cancellation gist](https://gist.github.com/L422Y/53b75be4bb8afd5cd6143e74150cc142) and is used with permission, subject to attribution and a link to the original gist.

See [`NOTICE.md`](./NOTICE.md) for the full authorship, provenance and permission details.
