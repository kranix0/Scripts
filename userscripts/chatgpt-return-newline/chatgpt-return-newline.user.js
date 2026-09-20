// ==UserScript==
// @name         ChatGPT Return = Newline
// @namespace    com.dhanapalan.userscripts
// @version      1.0.0
// @description  Restores plain Enter/Return as a newline in ChatGPT's new composer UI instead of sending the prompt.
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
// Some accounts receiving ChatGPT's newer composer UI have seen plain Enter/Return
// submit the prompt even when their ChatGPT preference is configured for a newline.
//
// Behaviour:
// - Plain Enter/Return -> newline
// - Shift+Enter, Cmd+Enter, Ctrl+Enter and Option/Alt+Enter -> left to ChatGPT
//
// Scope:
// This script intentionally fixes only the newline regression. It does not modify
// ChatGPT navigation, New Chat behaviour, or any other UI.
//
// Release history:
// https://github.com/kranix0/Scripts/blob/main/userscripts/chatgpt-return-newline/CHANGELOG.md

(() => {
  'use strict';

  const COMPOSER =
    'form[data-chatgpt-composer] ' +
    '.ProseMirror[contenteditable="true"][role="textbox"]';

  window.addEventListener('keydown', (event) => {
    if (
      !event.isTrusted ||
      event.key !== 'Enter' ||
      event.isComposing ||
      event.shiftKey ||
      event.metaKey ||
      event.ctrlKey ||
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

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

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
