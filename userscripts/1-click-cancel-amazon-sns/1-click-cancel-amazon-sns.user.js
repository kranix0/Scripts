// ==UserScript==
// @name         1-Click Cancel Amazon S&S
// @namespace    https://github.com/kranix0/scripts/userscripts/amazon-sns-cancel
// @version      0.4.0
// @description  Adds a one-click button to Amazon Subscribe & Save pages to cancel visible subscriptions.
// @author       Sridhar Dhanapalan <sridhar@dhanapalan.com>
// @license      Custom; attribution required; original gist credit/link required
// @downloadURL  https://raw.githubusercontent.com/kranix0/scripts/main/userscripts/1-click-cancel-amazon-sns/1-click-cancel-amazon-sns.user.js
// @updateURL    https://raw.githubusercontent.com/kranix0/scripts/main/userscripts/1-click-cancel-amazon-sns/1-click-cancel-amazon-sns.user.js
// @match        https://www.amazon.com/auto-deliveries*
// @match        https://www.amazon.com.au/auto-deliveries*
// @match        https://www.amazon.co.uk/auto-deliveries*
// @match        https://www.amazon.ca/auto-deliveries*
// @match        https://www.amazon.de/auto-deliveries*
// @match        https://www.amazon.fr/auto-deliveries*
// @match        https://www.amazon.it/auto-deliveries*
// @match        https://www.amazon.es/auto-deliveries*
// @match        https://www.amazon.nl/auto-deliveries*
// @match        https://www.amazon.co.jp/auto-deliveries*
// @match        https://www.amazon.in/auto-deliveries*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

// Designed for simplicity:
// - The button is the confirmation: clicking it cancels exactly what its label says.
// - Visible-page cancellation only. No pagination.
//
// Changelog:
// 0.4.0:
// - Shows a one-click floating button with the number of visible Subscribe & Save items found on the current Amazon auto-deliveries page.
// - Cancels only the visible/current-page subscriptions listed in the button label; pagination and multi-page cancellation are intentionally out of scope for this beta.
// - Uses the current Amazon marketplace origin instead of a hardcoded amazon.com origin, so the same cancellation path can work across supported Amazon domains.
// - Adds request timeouts and per-item success/failure reporting so the final alert does not silently imply success when an item fails.
//
// Provenance:
// The core cancellation mechanism is adapted from L422Y's Amazon Subscribe & Save gist:
// https://gist.github.com/L422Y/53b75be4bb8afd5cd6143e74150cc142
// Used with permission; attribution/link required.

(() => {
  'use strict';

  const SCRIPT_NAME = '1-Click Cancel Amazon S&S';
  const BUTTON_ID = 'amazon-sns-cancel-launcher';
  const CANCEL_TIMEOUT_MS = 15000;

  function unique(values) {
    return Array.from(new Set(values));
  }

  function getVisibleSubscriptionIds() {
    return unique(
      Array.from(document.querySelectorAll('[data-subscription-id]'))
        .map((element) => element.getAttribute('data-subscription-id'))
        .filter(Boolean)
    );
  }

  async function fetchWithTimeout(url, options, timeoutMs) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(url, Object.assign({}, options || {}, {
        signal: controller.signal,
      }));
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function formatRunSummary(results) {
    const successful = results.filter((result) => result.ok);
    const failed = results.filter((result) => !result.ok);
    const summary = [
      'Mode: visible page only',
      `Successful attempts: ${successful.length}`,
      `Failed attempts: ${failed.length}`,
    ];

    if (failed.length > 0) {
      summary.push('', 'Failed subscription(s):');
      failed.forEach((failure) => {
        summary.push(`- ${failure.subscriptionId}: ${failure.reason}`);
      });
    }

    summary.push('', "Refresh the page and verify Amazon's state before trying again.");
    return summary.join('\n');
  }

  function updateButton(button) {
    const ids = getVisibleSubscriptionIds();

    if (ids.length === 0) {
      button.textContent = '🛒 No visible S&S found';
      button.disabled = true;
      button.title = 'No visible Subscribe & Save subscriptions were found on this page.';
      return;
    }

    button.textContent = `🛒 Cancel ${ids.length} visible S&S`;
    button.disabled = false;
    button.title = 'Cancels only the subscriptions visible on this page.';
  }

  async function cancelSubscription(subscriptionId) {
    let container;

    try {
      const panelUrl = `${location.origin}/auto-deliveries/ajax/cancelSubscription?deviceType=desktop&deviceContext=web&subscriptionId=${subscriptionId}`;
      const response = await fetchWithTimeout(panelUrl, {}, CANCEL_TIMEOUT_MS);

      if (!response.ok) {
        return {
          ok: false,
          subscriptionId,
          reason: `cancel panel request failed: HTTP ${response.status}`,
        };
      }

      const cancelPanel = await response.text();
      container = document.createElement('div');
      container.innerHTML = cancelPanel;
      document.body.appendChild(container);

      const form = container.querySelector("form[name='cancelForm']");
      if (!form) {
        return {
          ok: false,
          subscriptionId,
          reason: 'cancelForm not found',
        };
      }

      const formData = new FormData(form);
      const formEntries = Object.fromEntries(formData.entries());

      const submitResponse = await fetchWithTimeout(
        form.action,
        {
          method: form.method,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(formEntries),
        },
        CANCEL_TIMEOUT_MS
      );

      if (!submitResponse.ok) {
        return {
          ok: false,
          subscriptionId,
          reason: `cancel form submit failed: HTTP ${submitResponse.status}`,
        };
      }

      return {
        ok: true,
        subscriptionId,
      };
    } catch (error) {
      return {
        ok: false,
        subscriptionId,
        reason: error instanceof Error ? error.message : String(error),
      };
    } finally {
      if (container) {
        container.remove();
      }
    }
  }

  async function cancelVisibleSubscriptions(subscriptionIds) {
    return Promise.all(
      unique(subscriptionIds).map((subscriptionId) => cancelSubscription(subscriptionId))
    );
  }

  async function onClick(button) {
    const ids = getVisibleSubscriptionIds();

    if (ids.length === 0) {
      updateButton(button);
      return;
    }

    button.disabled = true;
    button.textContent = `⏳ Cancelling ${ids.length} S&S item(s)...`;

    try {
      const results = await cancelVisibleSubscriptions(ids);
      alert(`${SCRIPT_NAME}\n\n${formatRunSummary(results)}`);
    } catch (error) {
      console.error(`${SCRIPT_NAME} failed`, error);
      alert(
        `${SCRIPT_NAME}\n\n` +
        'The script hit an unexpected error before finishing.\n\n' +
        'Nothing else will run automatically. Check the page state before trying again.'
      );
    } finally {
      updateButton(button);
    }
  }

  function addButton() {
    const existingButton = document.getElementById(BUTTON_ID);
    if (existingButton) return existingButton;

    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.type = 'button';

    Object.assign(button.style, {
      position: 'fixed',
      right: '18px',
      bottom: '18px',
      zIndex: '2147483647',
      padding: '11px 16px',
      border: '1px solid rgba(255,255,255,0.35)',
      borderRadius: '999px',
      background: 'linear-gradient(135deg, #ff9900, #b12704)',
      color: '#fff',
      fontSize: '14px',
      fontWeight: '700',
      letterSpacing: '0.2px',
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(0,0,0,0.28)',
      textShadow: '0 1px 1px rgba(0,0,0,0.25)',
    });

    button.addEventListener('click', () => onClick(button));
    document.body.appendChild(button);
    updateButton(button);

    return button;
  }

  addButton();
})();
