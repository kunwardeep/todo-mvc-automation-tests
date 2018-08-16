exports.config = {
  host: 'selenium-hub',
  port: 4444,
  path: '/wd/hub',
  baseUrl: 'http://todomvc.com',
  framework: 'mocha',
  sync: false,
  waitforTimeout: 60000,
  logLevel: 'error',
  coloredLogs: true,
  reporters: ['dot', 'spec'],
  specs: ['./tests/*.test.js'],
  capabilities: [
    {
      browserName: 'chrome',
      chromeOptions: {
        args: ['no-sandbox', 'disable-web-security']
      }
    },
    {
      browserName: 'firefox'
    }
  ],
  mochaOpts: {
    timeout: 40000,
    compilers: ['js:babel-core/register']
  }
};
