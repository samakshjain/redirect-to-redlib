const browser = typeof browser !== 'undefined' ? browser : chrome;

const DEFAULT_SETTINGS = {
  enabled: true,
  baseUrl: "https://redlib.perennialte.ch",
  mode: "path-preserve"
};

let settings = { ...DEFAULT_SETTINGS };
let isLoaded = false;

// Track redirects to prevent loops
const redirectTracker = new Map();
const REDIRECT_COOLDOWN = 5000; // 5 seconds
const MAX_TRACKER_SIZE = 100;

// Load settings on startup
browser.storage.local.get(DEFAULT_SETTINGS).then(data => {
  settings = { ...settings, ...data };
  isLoaded = true;
  console.log("Redlib redirector loaded with settings:", settings);
}).catch(err => {
  console.error("Failed to load settings:", err);
  isLoaded = true; // Still allow extension to work with defaults
});

// Listen for settings changes
browser.storage.local.onChanged.addListener((changes, area) => {
  // Force immediate reload of ALL settings to avoid stale cache
  browser.storage.local.get(DEFAULT_SETTINGS).then(data => {
    settings = { ...DEFAULT_SETTINGS, ...data };
    console.log("Settings reloaded:", settings);
  });
});

// Build redirect URL
function buildRedirectUrl(originalUrl) {
  try {
    const u = new URL(originalUrl);
    const base = new URL(settings.baseUrl);

    // Prevent redirecting if already on the Redlib instance
    if (u.hostname === base.hostname) {
      return null;
    }

    if (settings.mode === "pass-url") {
      base.searchParams.set("url", originalUrl);
      return base.toString();
    }

    // path-preserve mode
    const newPath = base.pathname.replace(/\/$/, "") + u.pathname + u.search + u.hash;
    return base.origin + newPath;
  } catch (e) {
    console.error("Error building redirect URL:", e);
    return null;
  }
}

// Clean up old tracker entries
function cleanupTracker() {
  if (redirectTracker.size > MAX_TRACKER_SIZE) {
    const entries = Array.from(redirectTracker.entries());
    const now = Date.now();

    // Remove entries older than cooldown period
    entries.forEach(([url, timestamp]) => {
      if (now - timestamp > REDIRECT_COOLDOWN) {
        redirectTracker.delete(url);
      }
    });

    // If still too large, keep only most recent 50
    if (redirectTracker.size > MAX_TRACKER_SIZE) {
      const sorted = entries.sort((a, b) => b[1] - a[1]);
      redirectTracker.clear();
      sorted.slice(0, 50).forEach(([url, timestamp]) => {
        redirectTracker.set(url, timestamp);
      });
    }
  }
}

// Main redirect handler
browser.webRequest.onBeforeRequest.addListener(
  details => {
    // Wait for settings to load
    if (!isLoaded) {
      console.log("Settings not yet loaded, skipping redirect");
      return {};
    }

    // Check if extension is enabled
    if (!settings.enabled) {
      return {};
    }

    // Prevent redirect loops
    const now = Date.now();
    const lastRedirect = redirectTracker.get(details.url);
    if (lastRedirect && now - lastRedirect < REDIRECT_COOLDOWN) {
      console.warn("Preventing redirect loop for:", details.url);
      return {};
    }

    // Try to build redirect URL
    const redirectUrl = buildRedirectUrl(details.url);

    if (redirectUrl) {
      // Track this redirect
      redirectTracker.set(details.url, now);
      cleanupTracker();

      console.log(`Redirecting: ${details.url} → ${redirectUrl}`);
      return { redirectUrl };
    }

    return {};
  },
  {
    urls: [
      "*://reddit.com/*",
      "*://*.reddit.com/*",
      "*://redd.it/*"
    ]
  },
  ["blocking"]
);

// Clean up tracker periodically
setInterval(() => {
  cleanupTracker();
}, 60000); // Every minute
