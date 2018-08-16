const Promise = require('es6-promise').Promise;
const selenium = require('selenium-standalone');

const startSeleniumServer = () => {
  return new Promise((resolve, reject) => {
    selenium.start((err, process) => err ? reject(err) : resolve(process));
  });
};

let seleniumProcess;

const ciConfig = {
  host: 'selenium-hub',
  port: 4444,
  path: '/wd/hub'
};

let defaultConfig = {
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
      browserName: 'firefox'
    }
  ],
  mochaOpts: {
    timeout: 40000,
    compilers: ['js:babel-core/register']
  },
  // eslint-disable-next-line consistent-return
  onPrepare: () => {
    if (process.env.LOCAL === true) {
      return startSeleniumServer()
        .then(process => {
          seleniumProcess = process;
        });
    }
  },
  onComplete: () => {
    if (process.env.LOCAL === true) {
    // eslint-disable-next-line no-console
      console.log('Shutting down Selenium');
      seleniumProcess.kill();
    }
  }
};

if (process.env.LOCAL === true) {
  defaultConfig = Object.assign(ciConfig, defaultConfig);
}

exports.config = defaultConfig;
