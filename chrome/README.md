# Chrome build (Manifest V3)

This directory is the Chrome Web Store package. The parent directory remains the
Firefox (Manifest V2) package; the two builds intentionally differ:

- Chrome uses a `service_worker` background script and `declarativeNetRequest`
  rules instead of `webRequest` + `webRequestBlocking`, which Chrome no longer
  allows for published extensions.
- Only the path-preserve redirect mode is available. The "pass URL as a query
  parameter" mode cannot be expressed with declarativeNetRequest rules, because
  rules cannot URL-encode the original URL.

## Build the upload zip

The manifest must sit at the root of the archive:

```bash
cd chrome
zip -r ../web-ext-artifacts/redirect_reddit_to_redlib_chrome-1.0.1.zip . \
  -x '.DS_Store' -x '__MACOSX/*'
```

Then upload `web-ext-artifacts/redirect_reddit_to_redlib_chrome-1.0.1.zip` in the
Chrome Web Store developer dashboard.

## Test unpacked

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select this `chrome/` directory
4. Set a different instance on the options page, visit `https://reddit.com/r/firefox`,
   and confirm the redirect follows the new setting
