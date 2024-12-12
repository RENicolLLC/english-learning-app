module.exports = {
  version: 2,
  snapshot: {
    widths: [375, 768, 1366, 1920],
    minHeight: 1024,
    percyCSS: `
      // Hide dynamic content that might cause false positives
      .timestamp { visibility: hidden; }
      .random-content { visibility: hidden; }
    `
  },
  discovery: {
    allowedHostnames: ['localhost'],
    disallowedHostnames: [],
    networkIdleTimeout: 100
  }
}; 