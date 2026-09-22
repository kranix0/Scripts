// ==UserScript==
// @name         ChatGPT Return = Newline
// @namespace    com.dhanapalan.userscripts
// @version      1.1.0
// @description  Restores plain Enter/Return as a newline and Cmd/Ctrl+Enter as Send in ChatGPT's new composer UI.
// @author       Sridhar Dhanapalan <sridhar@dhanapalan.com>
// @license      MIT
// @homepageURL  https://github.com/kranix0/Scripts/tree/main/userscripts/chatgpt-return-newline
// @supportURL   https://github.com/kranix0/Scripts/issues
// @downloadURL  https://raw.githubusercontent.com/kranix0/Scripts/main/userscripts/chatgpt-return-newline/chatgpt-return-newline.user.js
// @updateURL    https://raw.githubusercontent.com/kranix0/Scripts/main/userscripts/chatgpt-return-newline/chatgpt-return-newline.user.js
// @match        https://chatgpt.com/*
// @run-at       document-start
// @grant        none
// @noframes
// ==/UserScript==

// Purpose:
// Some accounts receiving ChatGPT's newer composer UI have seen:
// - plain Enter/Return submit the prompt instead of inserting a newline; and
// - Cmd/Ctrl+Enter send inconsistently.
//
// Behaviour:
// - Plain Enter/Return -> newline
// - Cmd+Enter (macOS) / Ctrl+Enter (Windows/Linux) -> Send
// - Shift+Enter and Option/Alt+Enter -> left to ChatGPT
//
// Scope:
// This script intentionally fixes only composer keyboard behaviour. It does not
// modify ChatGPT navigation, New Chat behaviour, or any other UI.
//
// Release history:
// https://github.com/kranix0/Scripts/blob/main/userscripts/chatgpt-return-newline/CHANGELOG.md

(() => {
  'use strict';

  // ChatGPT is currently serving more than one composer DOM variant.
  // Prefer semantic/stable hooks and retain known variants for gradual rollouts
  // or A/B cohorts.
  const COMPOSER = [
    '#prompt-textarea.ProseMirror[contenteditable="true"][role="textbox"]',
    'form[data-type="unified-composer"] .ProseMirror[contenteditable="true"][role="textbox"]',
    'form[data-chatgpt-composer] .ProseMirror[contenteditable="true"][role="textbox"]',
  ].join(', ');

  window.addEventListener('keydown', (event) => {
    if (
      !event.isTrusted ||
      event.key !== 'Enter' ||
      event.isComposing ||
      event.altKey
    ) {
      return;
    }

    if (!(event.target instanceof Element)) {
      return;
    }

    const editor = event.target.closest(COMPOSER);
    if (!editor) {
      return;
    }

    const wantsSend = !event.shiftKey && (event.metaKey || event.ctrlKey);

    if (wantsSend) {
      const form = editor.closest('form');
      const submitButton = form?.querySelector('button[type="submit"]:not([disabled])');

      // If ChatGPT does not currently expose an enabled submit control, leave the
      // keypress alone rather than swallowing it.
      if (!(form instanceof HTMLFormElement) || !(submitButton instanceof HTMLElement)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (typeof form.requestSubmit === 'function' && submitButton instanceof HTMLButtonElement) {
        form.requestSubmit(submitButton);
      } else {
        submitButton.click();
      }

      return;
    }

    // Modified shortcuts other than Cmd/Ctrl+Enter remain under ChatGPT's control.
    if (event.shiftKey || event.metaKey || event.ctrlKey) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    // Reuse ChatGPT's existing Shift+Enter newline behaviour rather than editing
    // ProseMirror state directly.
    editor.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
      composed: true,
    }));

    editor.dispatchEvent(new KeyboardEvent('keyup', {
      key: 'Enter',
      code: 'Enter',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
      composed: true,
    }));
  }, true);
})();
