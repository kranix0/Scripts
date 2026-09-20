# Scripts

*Small, useful scripts maintained for low-friction, practical use.*

This repository contains small, practical scripts that solve real-world problems. They are intentionally simple, documented, and designed to be easy to adopt and maintain.

## Userscripts

Userscripts can be installed directly from their `.user.js` URL. For a browser-based runtime, **[Violentmonkey](https://violentmonkey.github.io/get-it/)** is the preferred open-source option. AdGuard Desktop can also run userscripts at the desktop layer across supported browsers.

| Userscript | What it does | Install |
| --- | --- | --- |
| [ChatGPT Return = Newline](./userscripts/chatgpt-return-newline/) | Restores plain Enter/Return as a newline for the newer ChatGPT composer UI where Return may unexpectedly send the prompt. | **[Install](https://raw.githubusercontent.com/kranix0/Scripts/main/userscripts/chatgpt-return-newline/chatgpt-return-newline.user.js)** |
| [Startpage Location Guard](./userscripts/startpage-location-guard/) | Warns when Startpage silently loses a previously configured Search Location. | **[Install](https://raw.githubusercontent.com/kranix0/Scripts/main/userscripts/startpage-location-guard/startpage-location-guard.user.js)** |
| [1-Click Cancel Amazon S&S](./userscripts/1-click-cancel-amazon-sns/) | Adds a one-click control for cancelling visible Amazon Subscribe & Save subscriptions on the current page. | **[Install](https://raw.githubusercontent.com/kranix0/Scripts/main/userscripts/1-click-cancel-amazon-sns/1-click-cancel-amazon-sns.user.js)** |

Each userscript directory contains its own README, usage notes, limitations and changelog.

## Scope

This repository may contain:

* browser userscripts;
* shell scripts;
* small Python utilities;
* other lightweight automation helpers.

## Principles

Scripts in this repository should favour:

* boring reliability over cleverness;
* minimal hidden state;
* safe defaults;
* narrow, understandable permissions and execution scope;
* stable install/update URLs where practical.

## Licence

Unless a script folder says otherwise, scripts in this repository are licensed under the MIT Licence. See [`LICENSE`](./LICENSE).

Some scripts may include adapted third-party code, attribution requirements or additional provenance notes. Check the relevant script folder before reusing or redistributing a specific script.

## Attribution

This repository is shared under the MIT Licence to encourage reuse and adaptation.

If you build on something from this repository, I'd genuinely appreciate a mention or a link back. It's not a legal requirement under the licence, but it helps others discover the original work and supports future contributions.
