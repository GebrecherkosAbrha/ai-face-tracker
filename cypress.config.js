const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    supportFile: 'cypress/support/e2e.js',
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        // Allow camera for Chrome/Chromium
        if (browser.name === 'chrome' || browser.name === 'chromium') {
          launchOptions.args.push('--use-fake-ui-for-media-stream');
          launchOptions.args.push('--use-fake-device-for-media-stream');
        }
        
        // Allow camera for Firefox
        if (browser.name === 'firefox') {
          launchOptions.preferences['media.navigator.streams.fake'] = true;
          launchOptions.preferences['media.navigator.permission.disabled'] = true;
        }
        
        return launchOptions;
      });
    }
  },
}); 