# ChatGPT Return = Newline

Restore **plain Enter/Return as a newline** in ChatGPT's new composer UI when it unexpectedly sends the prompt instead.

**[Install the userscript](https://raw.githubusercontent.com/kranix0/Scripts/main/userscripts/chatgpt-return-newline/chatgpt-return-newline.user.js)** · [Get Violentmonkey](https://violentmonkey.github.io/get-it/) · [View source](./chatgpt-return-newline.user.js)

## Why this exists

On **20 September 2026**, a newer ChatGPT interface started appearing on some accounts. In that interface, plain **Enter/Return can submit the prompt instead of inserting a newline**, even when ChatGPT is configured to use a modified shortcut for sending.

That makes multi-line prompt editing unexpectedly risky: a normal line break can send an unfinished message.

This userscript restores the expected editing behaviour:

- **Enter / Return** → insert a newline
- **Shift+Enter** → left to ChatGPT
- **Cmd+Enter** on macOS → left to ChatGPT
- **Ctrl+Enter** on Windows/Linux → left to ChatGPT
- **Option/Alt+Enter** → left to ChatGPT

The script does not redefine modified shortcuts. It only prevents an unmodified Enter/Return from being treated as Send.

## Is this for everyone?

No.

This workaround targets a **new ChatGPT UI variant observed on 20 September 2026**. The interface is not yet universal. OpenAI may be gradually rolling it out, A/B testing variants, or otherwise serving different composer implementations to different accounts; there is no published rollout schedule assumed here.

You probably **do not need this script** if:

- plain Enter/Return already creates the newline behaviour you want; or
- your ChatGPT account is still using an older composer UI without this regression.

If OpenAI fixes the behaviour upstream, disabling or uninstalling this script is preferable to keeping an unnecessary workaround.

## What it does

The script listens only for an **unmodified, trusted Enter keypress inside ChatGPT's composer**.

When that happens it:

1. prevents ChatGPT from treating the original keypress as Send;
2. re-dispatches the action as **Shift+Enter**, which the current composer already understands as a newline.

It does **not**:

- edit prompt content directly;
- replace ChatGPT DOM elements;
- modify New Chat navigation;
- make network requests;
- use background polling;
- collect telemetry;
- load dependencies.

This narrow approach was chosen after testing broader workarounds against the new UI. Keeping only the verified newline fix reduces maintenance and limits the script's blast radius.

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

The script has been verified with **Vivaldi + AdGuard Desktop on macOS** against the new ChatGPT UI observed on 20 September 2026.

## Usage

There is no UI and nothing to configure.

After installing the script, open or reload ChatGPT and type a multi-line message.

### Quick verification

Type:

```text
one
```

Press **Return**, then type:

```text
two
```

Expected result:

```text
one
two
```

The first Return should **not** send the message.

If your ChatGPT settings use **Cmd+Return** or **Ctrl+Return** for sending, that modified shortcut remains under ChatGPT's control.

## Compatibility

Current compatibility contract:

- host: `https://chatgpt.com/*`
- composer: a ChatGPT `form[data-chatgpt-composer]` containing a ProseMirror `contenteditable` textbox
- newline action: ChatGPT continues to interpret **Shift+Enter** as a newline

The script deliberately avoids generated CSS class names and does not depend on the New Chat/sidebar structure.

### Verified

- Vivaldi on macOS
- AdGuard Desktop userscript runtime
- ChatGPT UI variant observed on 20 September 2026

### Expected but not separately verified yet

Because the script uses standard userscript metadata and ordinary browser events with `@grant none`, it is designed to work with userscript managers such as Violentmonkey on current Chromium and Firefox-family browsers.

If you confirm another combination, contributions are welcome.

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

The userscript includes stable:

- `@updateURL`
- `@downloadURL`

metadata pointing to the raw file on the repository's `main` branch.

Compatible userscript managers can therefore discover newer releases through their normal update mechanism.

**Release contract:** `main` is the stable channel. Development should happen away from `main`, and `@version` should be incremented before a changed release is published.

## Known limitation: New Chat navigation

The same ChatGPT UI rollout also changed **New Chat** from normal link-style navigation into JavaScript button navigation on affected accounts. That can break browser gestures such as modified-click to open New Chat in another tab.

This userscript **does not try to fix that regression**.

Several generic and ChatGPT-specific navigation workarounds were tested, but none preserved the source tab reliably against the 20 September 2026 UI. That functionality was intentionally left out rather than making this script brittle or invasive.

## Troubleshooting

### Return still sends

1. Confirm the userscript is enabled for `chatgpt.com`.
2. Hard-reload ChatGPT.
3. Confirm your userscript manager reports the script as active on the page.
4. Check whether ChatGPT has changed the composer structure again.

If the UI has changed, please [open an issue](https://github.com/kranix0/Scripts/issues) with:

- browser and version;
- userscript manager and version;
- whether the older or newer ChatGPT UI is visible;
- the observed Return behaviour.

Avoid including private prompt or conversation content in bug reports.

### Return works but another ChatGPT shortcut does not

This script only handles **plain Enter/Return**. Modified key combinations are deliberately left to ChatGPT.

## Maintenance philosophy

This is a compatibility shim, not an attempt to redesign ChatGPT.

The maintenance preference is:

1. use the site's existing newline behaviour rather than editing the editor directly;
2. depend on stable semantic attributes rather than generated classes;
3. change as little as possible;
4. remove the workaround when the upstream behaviour is fixed.

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
