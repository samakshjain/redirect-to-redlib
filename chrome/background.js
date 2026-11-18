// Chrome Manifest V3 build.
// Redirects are applied by declarativeNetRequest rules instead of blocking
// webRequest handlers, which Chrome no longer allows for published extensions.

const DEFAULT_SETTINGS = {
  enabled: true,
  baseUrl: "https://safereddit.com"
};

const RULE_IDS = {
  reddit: 1,
  reddIt: 2
};

// Matches reddit.com, any subdomain (www., old., np., ...) and redd.it.
// The path, query and hash are captured so they can be preserved.
const REDDIT_FILTER = "^https?://(?:[a-z0-9-]+\\.)*reddit\\.com(/.*)?$";
const REDD_IT_FILTER = "^https?://(?:[a-z0-9-]+\\.)*redd\\.it(/.*)?$";

// Serialize rule updates so concurrent events can't interleave.
let updateQueue = Promise.resolve();

function buildRules(settings) {
  if (!settings.enabled) {
    return [];
  }

  let base;
  try {
    base = new URL(settings.baseUrl);
  } catch (err) {
    console.error("Invalid base URL in settings:", settings.baseUrl);
    return [];
  }

  if (base.protocol !== "https:") {
    console.error("Base URL must use https:", settings.baseUrl);
    return [];
  }

  // Keep any path prefix the user configured, e.g. https://example.com/redlib
  const prefix = base.origin + base.pathname.replace(/\/$/, "");
  const substitution = prefix + "\\1";

  return [
    {
      id: RULE_IDS.reddit,
      priority: 1,
      action: {
        type: "redirect",
        redirect: { regexSubstitution: substitution }
      },
      condition: {
        regexFilter: REDDIT_FILTER,
        resourceTypes: ["main_frame"]
      }
    },
    {
      id: RULE_IDS.reddIt,
      priority: 1,
      action: {
        type: "redirect",
        redirect: { regexSubstitution: substitution }
      },
      condition: {
        regexFilter: REDD_IT_FILTER,
        resourceTypes: ["main_frame"]
      }
    }
  ];
}

async function applyRules() {
  const settings = await chrome.storage.local.get(DEFAULT_SETTINGS);
  const rules = buildRules(settings);
  const existing = await chrome.declarativeNetRequest.getDynamicRules();

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map(rule => rule.id),
    addRules: rules
  });

  console.log(
    rules.length
      ? `Redlib redirects active → ${settings.baseUrl}`
      : "Redlib redirects inactive"
  );
}

function scheduleRuleUpdate(reason) {
  updateQueue = updateQueue
    .then(applyRules)
    .catch(err => console.error(`Failed to update rules (${reason}):`, err));
  return updateQueue;
}

// Build rules on service worker startup so a fresh install or a browser
// restart always reflects the stored settings.
scheduleRuleUpdate("startup");

chrome.runtime.onInstalled.addListener(() => {
  scheduleRuleUpdate("install");
});

chrome.runtime.onStartup.addListener(() => {
  scheduleRuleUpdate("browser startup");
});

// Options page writes to storage; rebuild as soon as that happens.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && (changes.enabled || changes.baseUrl)) {
    scheduleRuleUpdate("settings changed");
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});
