const BrowserHelper = require('./BrowserHelper.js');
const browserHelper = new BrowserHelper();
const Promise = require('bluebird');
const todoTextBoxTag = '[id="new-todo"]';
const todoListTag = '[id="todo-list"]';
const inputTag = ' > input';
const labelTag = ' div > label';
const tickBoxTag = ' > div > input';
const closeIconTag = ' > div > button';
const clearCompletedTag = '[id="clear-completed"]';
const allTag = '[id="toggle-all"]';
const completedTag = '[href="#/completed"]';

module.exports = function HomePage() {
  this.isLoaded = () => browserHelper.isElementVisible(todoTextBoxTag);
  this.addTodo = text => () => browser.setValue(todoTextBoxTag, [text, 'Enter']).pause(500);

  this.getListOfTodos = () => $(todoListTag).$$('li');

  this.getNamesOfTodosInTheList = () => () => this.getListOfTodos()
                                                  .then(todos => Promise.map(todos, todo => browser.elementIdText(todo.ELEMENT)))
                                                  .then(todos => todos.map(todo => todo.value));
  this.getTodosById = () => this.getListOfTodos()
                                .then(todos => Promise.map(todos, todo => browser.elementIdAttribute(todo.ELEMENT, 'id')));

  this.editTodo = (todoNum, newTodo) => () => this.getTodosById()
                                                  .then(todos => {
                                                    const selectorId = todos[todoNum - 1].value;
                                                    const selector = `#${selectorId}${labelTag}`;
                                                    return browserHelper.doDoubleClick(selector).pause(500);
                                                  })
                                                  .then(() => {
                                                    return this.editLabelText(todoNum, ['Clear', newTodo, 'Enter']);
                                                  });

  this.editLabelText = (todoNum, values) => this.getTodosById()
                                                .then(todos => {
                                                  const selectorId = todos[todoNum - 1].value;
                                                  const selector = `#${selectorId}${inputTag}`;
                                                  return browser.setValue(selector, values).pause(500);
                                                });
  this.clickComplete = todoNum => () => this.getTodosById()
                                            .then(todos => {
                                              const selectorId = todos[todoNum - 1].value;
                                              const selector = `#${selectorId}${tickBoxTag}`;
                                              return browser.click(selector).pause(500);
                                            });
  this.getClassName = todoNum => this.getListOfTodos()
                                        .then(todos => Promise.map(todos, todo => browser.elementIdAttribute(todo.ELEMENT, 'class')))
                                        .then(todos => {
                                          const className = todos[todoNum - 1].value;
                                          return className;
                                        });

  this.isTodoComplete = todoNum => this.getClassName(todoNum)
                                    .then(className => {
                                      return className.includes('completed');
                                    });

  this.getLocalStorageValue = () => browserHelper.getLocalStoreValue('todos').then(storage => JSON.parse(storage.value));

  this.clickAllComplete = () => () => browser.click(allTag);

  this.clickCompleted = () => () => browser.click(completedTag);
  this.clickClearCompleted = () => () => browser.click(clearCompletedTag);
  this.clickCloseIcon = todoNum => () => this.getListOfTodos()
                                        .then(todos => Promise.map(todos, todo => browser.elementIdAttribute(todo.ELEMENT, 'id')))
                                        .then(todos => {
                                          const selectorId = todos[todoNum - 1].value;
                                          const viewableSelector = `#${selectorId}`;
                                          const clickSelector = `#${selectorId}${closeIconTag}`;
                                          return browser.moveToObject(viewableSelector).pause(500).click(clickSelector).pause(500);
                                        });
};
