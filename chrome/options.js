// Chrome Manifest V3 build (chrome.* + promises). The path-preserve redirect
// mode is the only one that declarativeNetRequest can express.

const DEFAULT_SETTINGS = {
  enabled: true,
  baseUrl: "https://safereddit.com"
};

const $ = id => document.getElementById(id);

// Validate URL
function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

// Update status message
function updateStatus(enabled) {
  const status = $("status");
  if (enabled) {
    status.textContent = "✓ Redirects are enabled";
    status.className = "status enabled";
  } else {
    status.textContent = "✗ Redirects are disabled";
    status.className = "status";
  }
}

// Load settings from storage
async function load() {
  try {
    const data = await chrome.storage.local.get(DEFAULT_SETTINGS);
    $("enabled").checked = data.enabled;
    $("baseUrl").value = data.baseUrl;

    updateStatus(data.enabled);
  } catch (err) {
    console.error("Failed to load settings:", err);
    $("status").textContent = "Error loading settings";
    $("status").className = "status";
  }
}

// Save settings to storage. The service worker watches storage and rebuilds
// its declarativeNetRequest rules automatically.
async function save() {
  const baseUrl = $("baseUrl").value.trim();
  const urlError = $("urlError");
  const saveBtn = $("save");

  // Validate URL
  if (!baseUrl) {
    urlError.textContent = "URL cannot be empty";
    urlError.classList.add("show");
    return;
  }

  if (!isValidUrl(baseUrl)) {
    urlError.textContent = "Please enter a valid HTTPS URL (e.g., https://safereddit.com)";
    urlError.classList.add("show");
    return;
  }

  // Clear any previous error
  urlError.classList.remove("show");

  const data = {
    enabled: $("enabled").checked,
    baseUrl: baseUrl.replace(/\/$/, "") // Remove trailing slash
  };

  try {
    await chrome.storage.local.set(data);

    // Visual feedback
    saveBtn.textContent = "✓ Saved!";
    saveBtn.classList.add("saved");
    updateStatus(data.enabled);

    setTimeout(() => {
      saveBtn.textContent = "Save";
      saveBtn.classList.remove("saved");
    }, 1500);
  } catch (err) {
    console.error("Failed to save settings:", err);
    saveBtn.textContent = "Error saving";
    setTimeout(() => {
      saveBtn.textContent = "Save";
    }, 1500);
  }
}

// Reset to default settings
async function reset() {
  if (!confirm("Reset all settings to defaults?")) {
    return;
  }

  try {
    await chrome.storage.local.set(DEFAULT_SETTINGS);
    await load();

    const resetBtn = $("reset");
    resetBtn.textContent = "✓ Reset!";
    setTimeout(() => {
      resetBtn.textContent = "Reset to defaults";
    }, 1500);
  } catch (err) {
    console.error("Failed to reset settings:", err);
  }
}

// Clear URL error when user starts typing
function clearUrlError() {
  $("urlError").classList.remove("show");
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  load();

  $("save").addEventListener("click", save);
  $("reset").addEventListener("click", reset);
  $("enabled").addEventListener("change", () => {
    updateStatus($("enabled").checked);
  });
  $("baseUrl").addEventListener("input", clearUrlError);

  // Allow Enter key to save
  $("baseUrl").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      save();
    }
  });
});
