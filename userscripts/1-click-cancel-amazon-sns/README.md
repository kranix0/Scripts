# 1-Click Cancel Amazon S&S

A one-click userscript for cancelling visible Amazon Subscribe & Save subscriptions on the current auto-deliveries page.

## Status

Current version: **0.4.2**

It operates on the current page only. Pagination and automatic multi-page cancellation are intentionally out of scope.

See [`CHANGELOG.md`](./CHANGELOG.md) for release history.

## What it does

- Adds a floating status and cancellation button to the bottom-right corner of supported Amazon Subscribe & Save pages.
- Shows an understated status button when no visible subscriptions are found, confirming that the userscript is installed and running.
- Shows the number of visible subscriptions detected on the current page.
- Cancels only the subscriptions represented by the number shown on the button.
- Provides explanatory tooltips for inactive, cancellation-ready and working states.
- Works from the current Amazon marketplace origin rather than relying on a hardcoded `amazon.com` address.
- Works with the main S&S links in Amazon's UI.
- Applies a timeout to each cancellation request.
- Reports per-item successes and failures after the run.

## Safety model

When visible subscriptions are found, the button label is the confirmation.

For example, clicking:

> **Cancel 3 visible S&S**

attempts to cancel the three visible subscriptions detected on the current page.

There is no additional confirmation dialog, and the operation cannot be undone by this script. Check the button count before clicking it.

When no visible subscriptions are found, the button appears in an understated status mode. Clicking it only confirms that the userscript is installed and running. It does not make any cancellation requests.

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
2. Check the floating button:
   - If no subscriptions are visible, click the understated status button to confirm that the userscript is running.
   - If subscriptions are visible, confirm that the displayed count matches the items you intend to cancel.
3. Click the cancellation button.
4. Review the success and failure summary.

If Amazon displays subscriptions across multiple pages, repeat the process separately on each page.

## Limitations

- Only subscriptions visible on the current page are processed.
- The script does not navigate through pagination.
- It depends on Amazon's current page structure and cancellation workflow.
- Successful cancellation of active subscriptions has been confirmed through user feedback.
- I no longer have active subscriptions myself – thanks to an earlier version of this script – so I cannot currently perform live cancellation testing.

## Licence and attribution

The majority of this userscript is original work maintained by Sridhar Dhanapalan and is provided under the repository's [MIT Licence](../../LICENSE).

The underlying Amazon cancellation mechanism is adapted from [L422Y's Amazon Subscribe & Save cancellation gist](https://gist.github.com/L422Y/53b75be4bb8afd5cd6143e74150cc142) and is used with permission, subject to attribution and a link to the original gist.

See [`NOTICE.md`](./NOTICE.md) for the full authorship, provenance and permission details.
