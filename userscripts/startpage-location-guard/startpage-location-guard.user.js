// ==UserScript==
// @name         Startpage Location Guard
// @namespace    com.dhanapalan.userscripts
// @version      0.1.0
// @description  Warns when a previously configured Startpage Search Location silently disappears.
// @author       Sridhar Dhanapalan <sridhar@dhanapalan.com>
// @license      MIT
// @homepageURL  https://github.com/kranix0/Scripts/tree/main/userscripts/startpage-location-guard
// @downloadURL  https://raw.githubusercontent.com/kranix0/Scripts/main/userscripts/startpage-location-guard/startpage-location-guard.user.js
// @updateURL    https://raw.githubusercontent.com/kranix0/Scripts/main/userscripts/startpage-location-guard/startpage-location-guard.user.js
// @match        https://www.startpage.com/*
// @match        https://startpage.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

// Trust model:
// - Startpage stores Search Location in the non-HttpOnly `locationPref` cookie.
// - The script arms itself only after it has observed that cookie at least once.
// - Armed state is stored by the userscript manager, independently of Startpage
//   site data, so expiry or clearing of Startpage cookies does not erase the guard.
// - If an armed browser later has no `locationPref` cookie, a persistent warning
//   is shown. The script does not modify Startpage cookies or search requests.

(() => {
  'use strict';

  const COOKIE_NAME = 'locationPref';
  const ARMED_KEY = 'location-guard-armed';
  const WARNING_ID = 'startpage-location-guard-warning';

  function getCookie(name) {
    const prefix = `${name}=`;
    for (const part of document.cookie.split(';')) {
      const cookie = part.trim();
      if (cookie.startsWith(prefix)) {
        return cookie.slice(prefix.length);
      }
    }
    return null;
  }

  function setArmed(value) {
    GM_setValue(ARMED_KEY, Boolean(value));
  }

  function isArmed() {
    return Boolean(GM_getValue(ARMED_KEY, false));
  }

  function removeWarning() {
    document.getElementById(WARNING_ID)?.remove();
  }

  function showWarning() {
    if (document.getElementById(WARNING_ID)) return;

    const banner = document.createElement('div');
    banner.id = WARNING_ID;
    banner.setAttribute('role', 'alert');
    banner.setAttribute('aria-live', 'assertive');

    Object.assign(banner.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      zIndex: '2147483647',
      boxSizing: 'border-box',
      padding: '12px 16px',
      background: '#a61b1b',
      color: '#fff',
      font: '600 14px/1.4 system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.30)',
    });

    const message = document.createElement('span');
    message.textContent =
      'Startpage Search Location is no longer set. Localised search results may differ.';

    const settingsLink = document.createElement('a');
    settingsLink.href = 'https://www.startpage.com/do/settings';
    settingsLink.textContent = 'Open Settings';
    Object.assign(settingsLink.style, {
      color: '#fff',
      marginLeft: '14px',
      textDecoration: 'underline',
      whiteSpace: 'nowrap',
    });

    const stopButton = document.createElement('button');
    stopButton.type = 'button';
    stopButton.textContent = 'Stop monitoring';
    stopButton.title = 'Use this if you intentionally no longer use Startpage Search Location.';
    Object.assign(stopButton.style, {
      marginLeft: '14px',
      padding: '3px 8px',
      border: '1px solid rgba(255,255,255,0.7)',
      borderRadius: '4px',
      background: 'transparent',
      color: '#fff',
      font: 'inherit',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    });
    stopButton.addEventListener('click', () => {
      setArmed(false);
      removeWarning();
    });

    banner.append(message, settingsLink, stopButton);
    document.documentElement.appendChild(banner);
  }

  function checkLocationPreference() {
    const locationValue = getCookie(COOKIE_NAME);

    if (locationValue !== null && locationValue !== '') {
      setArmed(true);
      removeWarning();
      return;
    }

    if (isArmed()) {
      showWarning();
    }
  }

  // The cookie is already available at document-start in normal navigation, but
  // DOM readiness is required before presenting the warning reliably.
  checkLocationPreference();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkLocationPreference, { once: true });
  } else {
    checkLocationPreference();
  }
})();
