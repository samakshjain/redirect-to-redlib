# Firefox build (Manifest V2)

This directory is the Firefox Add-ons (AMO) package. The `chrome/` directory is a
separate Manifest V3 package; the two builds intentionally differ:

- Firefox uses a Manifest V2 background script with `webRequest` +
  `webRequestBlocking`, which Firefox still supports. Chrome no longer allows
  either for published extensions, so its build uses `declarativeNetRequest`.
- Both redirect modes are available here: path preserve and pass-URL.
- `strict_min_version` is Firefox 140, with `gecko_android` requiring 142 (the
  version that added `data_collection_permissions` support).

## Build the upload zip

From the repository root:

```bash
web-ext lint --source-dir firefox
web-ext build --source-dir firefox
```

The package is written to `web-ext-artifacts/redirect_reddit_to_redlib-<version>.zip`.
Upload that file at the [AMO developer hub](https://addons.mozilla.org/developers/).
Bump `version` in `manifest.json` for every upload — AMO rejects a version that
was already published.

## Test temporarily

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on** and select `firefox/manifest.json`
3. Set an instance on the options page, visit `https://reddit.com/r/firefox`,
   and confirm the redirect follows the new setting

See [../README.md](../README.md) for the shared project overview.
