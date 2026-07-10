// ==UserScript==
// @name         1-Click Cancel Amazon S&S
// @namespace    com.dhanapalan.userscripts
// @version      0.4.2
// @description  Adds a one-click button to Amazon Subscribe & Save pages to cancel visible subscriptions.
// @author       Sridhar Dhanapalan <sridhar@dhanapalan.com>
// @license      MIT; see NOTICE.md for third-party attribution
// @downloadURL  https://raw.githubusercontent.com/kranix0/Scripts/main/userscripts/1-click-cancel-amazon-sns/1-click-cancel-amazon-sns.user.js
// @updateURL    https://raw.githubusercontent.com/kranix0/Scripts/main/userscripts/1-click-cancel-amazon-sns/1-click-cancel-amazon-sns.user.js
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
// Release history:
// https://github.com/kranix0/Scripts/blob/main/userscripts/1-click-cancel-amazon-sns/CHANGELOG.md
//
// Provenance:
// The core cancellation mechanism is adapted from L422Y's Amazon Subscribe & Save gist:
// https://gist.github.com/L422Y/53b75be4bb8afd5cd6143e74150cc142
// Permission: https://gist.github.com/L422Y/53b75be4bb8afd5cd6143e74150cc142?permalink_comment_id=6240234#gistcomment-6240234
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

  function setButtonMode(button, mode, count = 0) {
    if (mode === 'empty') {
      button.dataset.mode = 'empty';
      button.disabled = false;
      button.textContent = '✓ 1-Click S&S active';
      button.title =
        'The userscript is running. No visible Subscribe & Save subscriptions ' +
        'were found on this page. Click for details.';

      Object.assign(button.style, {
        border: '1px solid #aaa',
        background: '#e7e7e7',
        color: '#555',
        cursor: 'help',
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        textShadow: 'none',
        opacity: '1',
      });
      return;
    }

    if (mode === 'working') {
      button.dataset.mode = 'working';
      button.disabled = true;
      button.textContent = `⏳ Cancelling ${count} S&S item(s)...`;
      button.title = 'Cancellation requests are in progress. Please wait.';

      Object.assign(button.style, {
        border: '1px solid rgba(255,255,255,0.35)',
        background: 'linear-gradient(135deg, #ff9900, #b12704)',
        color: '#fff',
        cursor: 'wait',
        boxShadow: '0 4px 14px rgba(0,0,0,0.28)',
        textShadow: '0 1px 1px rgba(0,0,0,0.25)',
        opacity: '0.75',
      });
      return;
    }

    const noun = count === 1 ? 'subscription' : 'subscriptions';
    button.dataset.mode = 'cancel';
    button.disabled = false;
    button.textContent = `🛒 Cancel ${count} visible S&S`;
    button.title =
      `Click to cancel the ${count} Subscribe & Save ${noun} visible on this page. ` +
      'The button is the confirmation.';

    Object.assign(button.style, {
      border: '1px solid rgba(255,255,255,0.35)',
      background: 'linear-gradient(135deg, #ff9900, #b12704)',
      color: '#fff',
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(0,0,0,0.28)',
      textShadow: '0 1px 1px rgba(0,0,0,0.25)',
      opacity: '1',
    });
  }

  function updateButton(button) {
    const ids = getVisibleSubscriptionIds();
    setButtonMode(button, ids.length === 0 ? 'empty' : 'cancel', ids.length);
  }

  async function cancelSubscription(subscriptionId) {
    let container;

    try {
      const encodedSubscriptionId = encodeURIComponent(subscriptionId);
      const panelUrl = `${location.origin}/auto-deliveries/ajax/cancelSubscription?deviceType=desktop&deviceContext=web&subscriptionId=${encodedSubscriptionId}`;
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

      const method = form.method.toUpperCase();
      if (method !== 'POST') {
        return {
          ok: false,
          subscriptionId,
          reason: `unexpected cancel form method: ${method}`,
        };
      }

      const formData = new FormData(form);
      const body = new URLSearchParams();
      for (const [name, value] of formData.entries()) {
        body.append(name, String(value));
      }

      const submitResponse = await fetchWithTimeout(
        form.action,
        {
          method,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
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
      setButtonMode(button, 'empty');
      alert(
        `${SCRIPT_NAME}\n\n` +
        'The userscript is installed and running on this page.\n\n' +
        'No visible Subscribe & Save subscriptions were found.\n\n' +
        'When subscriptions are present, the button will show how many visible items it can cancel.'
      );
      return;
    }

    setButtonMode(button, 'working', ids.length);

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
      borderRadius: '999px',
      fontSize: '14px',
      fontWeight: '700',
      letterSpacing: '0.2px',
    });

    button.addEventListener('click', () => onClick(button));
    document.body.appendChild(button);
    updateButton(button);

    return button;
  }

  addButton();
})();
