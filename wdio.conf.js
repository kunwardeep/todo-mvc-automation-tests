const Promise = require('es6-promise').Promise;
const selenium = require('selenium-standalone');

const startSeleniumServer = () => {
  return new Promise((resolve, reject) => {
    selenium.start((err, process) => err ? reject(err) : resolve(process));
  });
};

let seleniumProcess;

exports.config = {
  baseUrl: 'http://todomvc.com',
  framework: 'mocha',
  sync: false,
  waitforTimeout: 60000,
  logLevel: 'silent',
  coloredLogs: true,
  reporters: ['spec'],
  specs: ['./tests/*.test.js'],
  capabilities: [
    // {
    //   browserName: 'chrome',
    //   chromeOptions: {
    //     args: ['no-sandbox', 'disable-web-security']
    //   }
    // },
    {
      browserName: 'firefox'
    }
  ],
  mochaOpts: {
    timeout: 40000,
    compilers: ['js:babel-core/register']
  },
  onPrepare: () => {
    return startSeleniumServer()
      .then(process => {
        seleniumProcess = process;
      });
  },
  onComplete: () => {
    console.log('Shutting down Selenium');
    seleniumProcess.kill();
  }
};
