// web-ext configuration for the Firefox (Manifest V2) build in firefox/.
// Run web-ext from the repository root: web-ext build --source-dir firefox
export default {
  artifactsDir: "web-ext-artifacts",
  ignoreFiles: [
    "*.crx",
    "*.pem",
    "*.zip"
  ]
};
