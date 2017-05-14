const HomePage = require('../pageObjects/home.Page.js');
const homePage = new HomePage();
const BrowserHelper = require('../pageObjects/BrowserHelper.js');
const browserHelper = new BrowserHelper();
const EmberJsPage = require('../pageObjects/emberJs.Page.js');
const emberJsPage = new EmberJsPage();

module.exports = function NavigationHelper() {
  this.openHomePageAndClearLocalStorage = () => homePage.open()
                                                .then(() => browserHelper.clearLocalStorage());

  this.goToEmberJsApp = () => homePage.goToEmberJsApp()()
                              .then(() => emberJsPage.isLoaded())
                              .then(isLoaded => {
                                if (!isLoaded) {
                                  throw new Error('Failed to load the EmberJs App');
                                }
                                return true;
                              });

  this.openHomePageAndNaviagteToEmberJsApp = () => this.openHomePageAndClearLocalStorage()
                                                    .then(() => (this.goToEmberJsApp()));

  this.openHomePageAndNaviagteToEmberJsAppWithAddedTodos = todos => this.openHomePageAndClearLocalStorage()
                                                                    .then(() => browserHelper.addLocalStorage(todos))
                                                                    .then(() => this.goToEmberJsApp());
};
