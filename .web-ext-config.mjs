// web-ext configuration for the Firefox (Manifest V2) build.
// The chrome/ directory is a separate Manifest V3 package and must not ship
// inside the Firefox add-on.
export default {
  ignoreFiles: [
    "chrome",
    "chrome/**",
    "web-ext-artifacts/**",
    "*.crx",
    "*.pem"
  ]
};
