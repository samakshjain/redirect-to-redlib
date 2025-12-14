# Redirect Reddit to Redlib

Automatically redirect all Reddit links to Redlib, a privacy-respecting alternative frontend for Reddit.

## What it does

This extension intercepts Reddit URLs and seamlessly redirects them to your chosen Redlib instance. Redlib is a lightweight, privacy-friendly alternative to Reddit that doesn't track you or require JavaScript.

## Features

- **Automatic redirection** - Works on reddit.com, all Reddit subdomains (old.reddit.com, www.reddit.com, etc.), and redd.it short links
- **Customizable instance** - Choose your preferred Redlib instance from the options page
- **Two redirect modes:**
  - Path preserve: Maintains the Reddit URL structure (recommended)
  - Pass URL: Sends the original URL as a query parameter
- **Easy toggle** - Quickly enable or disable redirects from the options page
- **No data collection** - This extension does not collect, store, or transmit any personal data
- **Lightweight** - Minimal resource usage with no background tracking

## Privacy

This extension respects your privacy. It only stores your preferences locally in your browser and does not communicate with any external servers except for the redirects you initiate.

## Installation

### Firefox
Install from [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/redirect-reddit-to-redlib/)

### Chrome
Install from [Chrome Web Store](https://chrome.google.com/webstore) (link coming soon)

### Manual Installation

1. Download or clone this repository
2. **For Firefox:**
   - Open `about:debugging`
   - Click "This Firefox" → "Load Temporary Add-on"
   - Select the `manifest.json` file
3. **For Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the extension folder

## How to use

1. Install the extension
2. (Optional) Click the extension icon or visit the options page to configure your preferred Redlib instance
3. Visit any Reddit link - you'll automatically be redirected to Redlib

**Default Redlib instance:** https://redlib.perennialte.ch

## Configuration

Access the options page to customize:
- Enable/disable automatic redirects
- Set your preferred Redlib instance URL
- Choose between redirect modes

## License

MIT License - see [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## Links

- [Redlib Project](https://github.com/redlib-org/redlib)
- [List of Redlib Instances](https://github.com/redlib-org/redlib-instances)

## Disclaimer

This extension is not affiliated with Reddit, Inc. or the Redlib project.
