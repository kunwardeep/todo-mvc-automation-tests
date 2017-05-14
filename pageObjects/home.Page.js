const emberJsLink = '[href="examples/emberjs"]';
const BrowserHelper = require('./BrowserHelper.js');
const browserHelper = new BrowserHelper();

module.exports = function HomePage() {
  this.open = () => browser.url('/');
  this.goToEmberJsApp = () => () => browserHelper.clickVisibleElement(emberJsLink);
};
