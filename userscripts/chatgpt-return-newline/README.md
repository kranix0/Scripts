# ChatGPT Return = Newline

Keep **plain Enter/Return as a newline** and restore **Cmd+Enter / Ctrl+Enter as Send** when newer ChatGPT composer variants change those keyboard behaviours.

**[Install the userscript](https://raw.githubusercontent.com/kranix0/Scripts/main/userscripts/chatgpt-return-newline/chatgpt-return-newline.user.js)** · [Get Violentmonkey](https://violentmonkey.github.io/get-it/) · [View source](./chatgpt-return-newline.user.js)

## Why this exists

ChatGPT has been serving multiple composer UI variants during September 2026, and the keyboard behaviour has changed between them.

Two variants have been observed:

- **20 September 2026:** plain **Enter/Return could submit the prompt** instead of inserting a newline.
- **22 September 2026:** plain Return again inserts a newline, but the previous keyboard-shortcut settings screen is no longer visible and **Cmd+Return does nothing** on the observed macOS UI.

The interface is not universal. OpenAI may be gradually rolling changes out, A/B testing variants, or otherwise serving different implementations to different accounts; this project does not assume a published rollout schedule.

This userscript provides one stable keyboard contract across the known variants:

- **Enter / Return** → insert a newline
- **Cmd+Enter** on macOS → Send
- **Ctrl+Enter** on Windows/Linux → Send
- **Shift+Enter** → left to ChatGPT
- **Option/Alt+Enter** → left to ChatGPT

## Is this for everyone?

No.

You probably **do not need this script** if ChatGPT already gives you the keyboard behaviour above.

If OpenAI restores this behaviour upstream, disabling or uninstalling this compatibility shim is preferable to keeping an unnecessary workaround.

## What it does

The script listens only for trusted Enter keypresses inside known ChatGPT composer variants.

For **plain Enter/Return**, it prevents ChatGPT from treating the keypress as Send and re-dispatches the action as **Shift+Enter**, which the current composer understands as a newline.

For **Cmd+Enter / Ctrl+Enter**, it submits ChatGPT's own composer form using the browser's standard `requestSubmit()` path.

This is deliberate: in the 22 September UI, the composer form exists consistently, while the visible Send control is transient and is not present at all when the composer is empty. The script therefore avoids depending on a particular Send-button selector or element type.

It does **not**:

- edit prompt content directly;
- replace ChatGPT DOM elements;
- modify New Chat navigation;
- make network requests;
- use background polling;
- collect telemetry;
- load dependencies.

## Installation

### Recommended: Violentmonkey

[Violentmonkey](https://violentmonkey.github.io/) is an **open-source userscript manager** for Vivaldi, Chrome/Chromium, Firefox, Edge and other WebExtension-compatible browsers.

1. **[Install Violentmonkey](https://violentmonkey.github.io/get-it/)**.
2. Open **[Install ChatGPT Return = Newline](https://raw.githubusercontent.com/kranix0/Scripts/main/userscripts/chatgpt-return-newline/chatgpt-return-newline.user.js)**.
3. Review the script and confirm installation.
4. Reload ChatGPT.

Violentmonkey should recognise the `.user.js` URL and show its installation screen automatically.

### AdGuard Desktop

AdGuard Desktop can also run userscripts system-wide across supported browsers. This is useful if you already use AdGuard and want one userscript runtime at the desktop layer rather than installing a browser extension separately in each browser.

In **AdGuard for Mac**:

1. Open **AdGuard → Settings → Extensions**.
2. Add/import an extension from a URL.
3. Paste:

   `https://raw.githubusercontent.com/kranix0/Scripts/main/userscripts/chatgpt-return-newline/chatgpt-return-newline.user.js`

4. Install it.
5. Reload ChatGPT.

The userscript has been exercised with **Vivaldi + AdGuard Desktop on macOS** against ChatGPT composer variants observed on 20 and 22 September 2026.

## Usage

There is no UI and nothing to configure.

### Quick verification

1. Type `one`.
2. Press **Return**.
3. Type `two`.

Expected result:

```text
one
two
```

The Return should **not** send the message.

Then press **Cmd+Return** on macOS or **Ctrl+Return** on Windows/Linux.

Expected result: the current message is sent once.

## Compatibility

Current compatibility contract:

- host: `https://chatgpt.com/*`
- known composer hooks:
  - `#prompt-textarea.ProseMirror[contenteditable="true"][role="textbox"]`
  - `form[data-type="unified-composer"]`
  - the earlier `form[data-chatgpt-composer]` variant
- newline action: ChatGPT continues to interpret **Shift+Enter** as a newline
- send action: the editor remains inside an HTML `form` that responds to `requestSubmit()`

The script deliberately avoids generated CSS class names and does not depend on the New Chat/sidebar structure.

### Verified environment

- Vivaldi on macOS
- AdGuard Desktop userscript runtime
- ChatGPT composer variants observed on 20 and 22 September 2026

### Expected but not separately verified yet

Because the script uses standard userscript metadata, ordinary browser events and `@grant none`, it is designed to work with userscript managers such as Violentmonkey on current Chromium and Firefox-family browsers.

## Privacy and permissions

The script is intentionally small and inspectable.

- `@match` limits execution to `chatgpt.com`.
- `@grant none` requests no privileged userscript APIs.
- `@noframes` avoids unnecessary execution in frames.
- No network requests are made.
- No data is stored.
- No prompt text is read, copied or transmitted.
- No telemetry or analytics are included.

The complete installed program is the single `.user.js` file in this directory.

## Automatic updates

The userscript includes stable `@updateURL` and `@downloadURL` metadata pointing to the raw file on the repository's `main` branch.

Compatible userscript managers can therefore discover newer releases through their normal update mechanism.

**Release contract:** `main` is the stable channel. `@version` is incremented for changed releases.

## Known limitation: New Chat navigation

The same ChatGPT UI rollout also changed **New Chat** from normal link-style navigation into JavaScript button navigation on affected accounts. That can break browser gestures such as modified-click to open New Chat in another tab.

This userscript **does not try to fix that regression**.

Several generic and ChatGPT-specific navigation workarounds were tested, but none preserved the source tab reliably. That functionality was intentionally left out rather than making this script brittle or invasive.

## Troubleshooting

### Return still sends

1. Confirm the userscript is enabled for `chatgpt.com`.
2. Confirm it has updated to the latest version.
3. Hard-reload ChatGPT.
4. Confirm your userscript manager reports the script as active on the page.
5. Check whether ChatGPT has changed the composer structure again.

### Cmd/Ctrl+Enter does nothing

1. Confirm the userscript is version **1.1.0 or newer**.
2. Type some text so the composer has sendable content.
3. Press **Cmd+Return** on macOS or **Ctrl+Return** on Windows/Linux.
4. If nothing happens, open an issue with the browser, userscript runtime and current ChatGPT UI variant.

Avoid including private prompt or conversation content in bug reports.

## Maintenance philosophy

This is a compatibility shim, not an attempt to redesign ChatGPT.

The maintenance preference is:

1. use ChatGPT's existing editor and form behaviours rather than modifying editor state directly;
2. depend on stable semantic attributes rather than generated classes;
3. support known rollout variants without removing working older selectors;
4. change as little as possible;
5. remove the workaround when the upstream behaviour is fixed.

## Licence

This userscript is original work maintained by Sridhar Dhanapalan and is provided under the repository's [MIT Licence](../../LICENSE).

## Contributing

Issues and small compatibility fixes are welcome.

Please keep changes narrow and explain:

- what ChatGPT UI variant you observed;
- what browser/userscript runtime you tested;
- what changed in the DOM or keyboard behaviour;
- why the proposed change is necessary.

The goal is a small, understandable compatibility layer rather than a growing collection of unrelated ChatGPT tweaks.
