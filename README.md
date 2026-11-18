# Redirect Reddit to Redlib

Automatically redirect all Reddit links to [Redlib](https://github.com/redlib-org/redlib),
a privacy-respecting alternative frontend for Reddit.

This repository contains two builds of the same extension:

| Browser | Build | Location | Install |
| --- | --- | --- | --- |
| Firefox | Manifest V2 — `webRequest` + `webRequestBlocking` | `firefox/` | [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/redirect-reddit-to-redlib/) |
| Chrome | Manifest V3 — `declarativeNetRequest` | `chrome/` | [Chrome Web Store](https://chrome.google.com/webstore) (link coming soon) |

## Features

- **Automatic redirection** — Works on `reddit.com`, all Reddit subdomains
  (`www.reddit.com`, `old.reddit.com`, …), and `redd.it` short links
- **Customizable instance** — Choose any Redlib instance from the options page
- **Path preserve** — Keeps the Reddit URL structure, so
  `reddit.com/r/firefox` becomes `safereddit.com/r/firefox` (recommended, and the
  only mode available in the Chrome build)
- **Pass-URL mode** — Sends the original URL as a `?url=...` parameter instead
  (Firefox build only)
- **Enable/disable toggle** — Turn redirects off without uninstalling
- **No tracking, no remote code** — Settings live in local extension storage

**Default Redlib instance:** https://safereddit.com

## Installation

### Firefox

Install from [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/redirect-reddit-to-redlib/).

Manual: open `about:debugging#/runtime/this-firefox`, click **Load Temporary
Add-on**, and select `firefox/manifest.json`. See [firefox/README.md](firefox/README.md).

### Chrome

Install from the [Chrome Web Store](https://chrome.google.com/webstore) (link
coming soon).

Manual: open `chrome://extensions/`, enable **Developer mode**, click **Load
unpacked**, and select the `chrome/` folder. See [chrome/README.md](chrome/README.md).

> Chrome no longer loads Manifest V2 extensions, so the repository root is not a
> valid Chrome package. Always use the `chrome/` directory for Chrome.

## Usage

1. Install the extension
2. (Optional) Open the options page to configure your preferred Redlib instance
3. Visit any Reddit link — you'll be redirected automatically

## Repository layout

```
.
├── firefox/                 # Firefox (Manifest V2) package — upload this to AMO
│   ├── manifest.json
│   ├── background.js
│   ├── options.html
│   ├── options.js
│   ├── icons/
│   └── README.md
├── chrome/                  # Chrome (Manifest V3) package — upload this to CWS
│   ├── manifest.json
│   ├── background.js
│   ├── options.html
│   ├── options.js
│   ├── icons/
│   └── README.md
└── README.md                # this file
```

## Development

### Firefox

Requires [web-ext](https://github.com/mozilla/web-ext) (`npm install --global web-ext`).

```bash
web-ext lint --source-dir firefox     # validate the manifest
web-ext build --source-dir firefox    # writes web-ext-artifacts/*.zip
web-ext run --source-dir firefox      # temporary profile with the extension loaded
```

### Chrome

There is no build step. Load `chrome/` unpacked from `chrome://extensions/`, or
package it for upload:

```bash
cd chrome
zip -r ../web-ext-artifacts/redirect_reddit_to_redlib_chrome-<version>.zip . \
  -x '.DS_Store' -x '__MACOSX/*'
```

Both manifests share the same `version`, which must be bumped before uploading a
new release to either store.

## Privacy

This extension respects your privacy. It only stores your preferences locally in
your browser and does not communicate with any external servers except for the
redirects you initiate. It collects no analytics and loads no remote code.

## Links

- [Redlib Project](https://github.com/redlib-org/redlib)
- [List of Redlib Instances](https://github.com/redlib-org/redlib-instances)

## License

MIT License. There is currently no `LICENSE` file committed to this repository.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## Disclaimer

This extension is not affiliated with Reddit, Inc. or the Redlib project.
