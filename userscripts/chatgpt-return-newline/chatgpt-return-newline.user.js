// ==UserScript==
// @name         ChatGPT Return = Newline
// @namespace    com.dhanapalan.userscripts
// @version      1.1.0
// @description  Keeps plain Enter/Return as a newline and restores Cmd/Ctrl+Enter to send in newer ChatGPT composer UIs.
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
// ChatGPT is currently serving multiple composer variants during a changing UI
// rollout. On affected variants, plain Return and the send shortcut have changed
// independently.
//
// Behaviour:
// - Plain Enter/Return -> newline
// - Cmd+Enter (macOS) / Ctrl+Enter (Windows/Linux) -> send
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

  // Known semantic composer variants observed during the 2026-09 rollout.
  // Keep older selectors so an update does not break users still in another cohort.
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
      if (!(form instanceof HTMLFormElement)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      // Let ChatGPT's own form submission path decide whether the current
      // composer state is sendable. This avoids depending on the transient
      // Send button, which is not present while the composer is empty and may
      // change element type/attributes between UI variants.
      form.requestSubmit();
      return;
    }

    // Other modified Enter combinations remain under ChatGPT's control.
    if (event.shiftKey || event.metaKey || event.ctrlKey) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    // Reuse ChatGPT's existing Shift+Enter newline behaviour rather than
    // editing ProseMirror state directly.
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
