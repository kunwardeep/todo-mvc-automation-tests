module.exports = function BrowserHelper() {
  this.clickVisibleElement = function(locator) {
    return this.isElementVisible(locator).then(function() {
      return browser.execute(function(loc) {
        return document.querySelector(loc).click();
      }, locator);
    });
  };

  this.getVisibleText = function(locator) {
    return this.isElementVisible(locator).then(function() {
      return browser.getText(locator);
    });
  };

  this.isElementVisible = function(locator) {
    return browser.waitForExist(locator, 8000)
          .then(function() {
            return browser.isVisible(locator);
          });
  };

  this.clearLocalStorage = function() {
    return browser.execute(function() {
      return localStorage.clear();
    });
  };

  this.addLocalStorage = function(todos) {
    return browser.execute(function(listOfTodos) {
      return window.localStorage.setItem('todos', JSON.stringify(listOfTodos));
    }, todos);
  };

  this.getLocalStoreValue = function(key) {
    return browser.execute(function(k) {
      return localStorage[k];
    }, key);
  };

  this.doDoubleClick = function(selector) {
    return browser.execute(function(selectorStr) {
      const evt = new MouseEvent('dblclick', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      const cb = document.querySelector(selectorStr);
      return cb.dispatchEvent(evt);
    }, selector);
  };
};
