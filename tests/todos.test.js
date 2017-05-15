const NavigationHelper = require('../pageObjects/NavigationHelper.js');
const navigate = new NavigationHelper();
const EmberJsPage = require('../pageObjects/emberJs.Page.js');
const emberJsPage = new EmberJsPage();

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Todos-', () => {
  describe('I want to add a todo', () => {
    const todo = 'Todo 01';
    const expectedLocalStorageValue = [{ id: 1, title: todo, completed: false }];

    before(() => {
      return navigate.openHomePageAndNaviagteToEmberJsApp()
            .then(emberJsPage.addTodo(todo));
    });

    it('Should match the added todo value', () => {
      return emberJsPage.getNamesOfTodosInTheList()()
      .then(todos => (expect(todos[0]).to.equal(todo)));
    });

    it('Should update localStorage ', () => {
      return expect(emberJsPage.getLocalStorageValue()).to.eventually.deep.equal(expectedLocalStorageValue);
    });
  });

  // Adding this extra test to verify the id's are in sequence if you do not refresh.
  describe('I want to add two todos', () => {
    const todo1 = 'Todo 01';
    const todo2 = 'Todo 02';
    const expectedLocalStorageValue = [{ id: 1, title: todo1, completed: false }, { id: 2, title: todo2, completed: false }];

    before(() => {
      return navigate.openHomePageAndNaviagteToEmberJsApp()
            .then(emberJsPage.addTodo(todo1))
            .then(emberJsPage.addTodo(todo2));
    });

    it('Should match the added todo value', () => {
      return emberJsPage.getNamesOfTodosInTheList()()
      .then(todos => (expect(todos).to.deep.equal([todo1, todo2])));
    });

    it('Should update localStorage and the id should be in sequence', () => {
      return expect(emberJsPage.getLocalStorageValue()).to.eventually.deep.equal(expectedLocalStorageValue);
    });
  });

  describe('I want to edit the content of an existing Todo item', () => {
    const listOfPreExistingTodos = [{ id: 1, title: 'Todo 01', completed: false }];
    const editedText = 'Todo Edited';
    const expectedLocalStorageValue = [{ id: 1, title: editedText, completed: false }];
    const firstTodo = 1;

    before(() => {
      return navigate.openHomePageAndNaviagteToEmberJsAppWithAddedTodos(listOfPreExistingTodos)
              .then(emberJsPage.editTodo(firstTodo, editedText));
    });

    it('Should match the number of todos in the lists', () => {
      return emberJsPage.getNamesOfTodosInTheList()()
        .then(todos => (expect(todos.length).to.equal(1)));
    });

    it('Should match the edited todo value', () => {
      return emberJsPage.getNamesOfTodosInTheList()()
      .then(todos => (expect(todos[0]).to.equal(editedText)));
    });

    // This test finds the bug.Local storage is not being updated
    it('Should update localStorage (This is a bug in the app itself.Does not update local storage)', () => {
      return expect(emberJsPage.getLocalStorageValue()).to.eventually.deep.equal(expectedLocalStorageValue);
    });
  });

  describe('I can complete a Todo by clicking inside the circle UI to the left of the Todo', () => {
    const listOfPreExistingTodos = [{ id: 1, title: 'Todo 01', completed: false }];
    const expectedLocalStorageValue = [{ id: 1, title: 'Todo 01', completed: true }];
    const firstTodo = 1;

    before(() => {
      return navigate.openHomePageAndNaviagteToEmberJsAppWithAddedTodos(listOfPreExistingTodos)
              .then(emberJsPage.clickComplete(firstTodo));
    });

    it('Should mark the todo as completed', () => {
      return expect(emberJsPage.isTodoComplete(firstTodo)).to.eventually.equal(true);
    });

    it('Should update localStorage and mark as completed', () => {
      return expect(emberJsPage.getLocalStorageValue()).to.eventually.deep.equal(expectedLocalStorageValue);
    });
  });

  describe('I can re-activate a completed Todo by clicking inside the circle UI', () => {
    const listOfPreExistingTodos = [{ id: 1, title: 'Todo 01', completed: true }];
    const expectedLocalStorageValue = [{ id: 1, title: 'Todo 01', completed: false }];
    const firstTodo = 1;

    before(() => {
      return navigate.openHomePageAndNaviagteToEmberJsAppWithAddedTodos(listOfPreExistingTodos)
              .then(emberJsPage.clickComplete(firstTodo));
    });

    it('Should mark the todo as incomplete', () => {
      return expect(emberJsPage.isTodoComplete(firstTodo)).to.eventually.equal(false);
    });

    it('Should update localStorage and mark as incomplete', () => {
      return expect(emberJsPage.getLocalStorageValue()).to.eventually.deep.equal(expectedLocalStorageValue);
    });
  });

  // This is assuming there was an existing todo when i landed on the page
  // and not the fact that i am adding two todos
  describe('I can add a second Todo', () => {
    const todo01 = 'Todo 01';
    const todo02 = 'Todo 02';
    const listOfPreExistingTodos = [{ id: 1, title: todo01, completed: false }];
    const expectedTodosInList = [todo01, todo02];
    const expectedLocalStorageValue = [{ id: 1, title: 'Todo 01', completed: false }, { id: 1, title: todo02, completed: false }];

    before(() => {
      return navigate.openHomePageAndNaviagteToEmberJsAppWithAddedTodos(listOfPreExistingTodos)
            .then(emberJsPage.addTodo(todo02));
    });

    it('Should match the added todos value', () => {
      return emberJsPage.getNamesOfTodosInTheList()()
        .then(todos => (expect(todos).to.deep.equal(expectedTodosInList)));
    });

    it('Should update localStorage ', () => {
      return expect(emberJsPage.getLocalStorageValue()).to.eventually.deep.equal(expectedLocalStorageValue);
    });
  });

  describe('I can complete all active Todos by clicking the down arrow at the top-left of the UI', () => {
    const listOfPreExistingTodos = [{ id: 1, title: 'Todo 01', completed: false },
                                    { id: 2, title: 'Todo 02', completed: false },
                                    { id: 3, title: 'Todo 03', completed: false }];
    const expectedLocalStorageValue = [{ id: 1, title: 'Todo 01', completed: true },
                                    { id: 2, title: 'Todo 02', completed: true },
                                    { id: 3, title: 'Todo 03', completed: true }];
    before(() => {
      return navigate.openHomePageAndNaviagteToEmberJsAppWithAddedTodos(listOfPreExistingTodos)
              .then(emberJsPage.clickAllComplete());
    });

    it('Should mark the todo item  1 as completed', () => {
      return expect(emberJsPage.isTodoComplete(1)).to.eventually.equal(true);
    });

    it('Should mark the todo item  2 as completed', () => {
      return expect(emberJsPage.isTodoComplete(2)).to.eventually.equal(true);
    });

    it('Should mark the todo item  3 as completed', () => {
      return expect(emberJsPage.isTodoComplete(3)).to.eventually.equal(true);
    });

    it('Should update localStorage and mark as complete', () => {
      return expect(emberJsPage.getLocalStorageValue()).to.eventually.deep.equal(expectedLocalStorageValue);
    });
  });

  describe('I can filter the visible Todos by Completed state', () => {
    const listOfPreExistingTodos = [{ id: 1, title: 'Todo 01', completed: true },
                                    { id: 2, title: 'Todo 02', completed: false },
                                    { id: 3, title: 'Todo 03', completed: true }];

    const expectedValue = ['Todo 01', 'Todo 03'];

    before(() => {
      return navigate.openHomePageAndNaviagteToEmberJsAppWithAddedTodos(listOfPreExistingTodos)
              .then(emberJsPage.clickCompleted());
    });

    it('Should match the completed todos value', () => {
      return emberJsPage.getNamesOfTodosInTheList()()
      .then(todos => (expect(todos).to.deep.equal(expectedValue)));
    });

    it('Should not change localStorage', () => {
      return expect(emberJsPage.getLocalStorageValue()).to.eventually.deep.equal(listOfPreExistingTodos);
    });
  });

  describe('I can clear a single Todo item from the list completely by clicking the Close icon', () => {
    const listOfPreExistingTodos = [{ id: 1, title: 'Todo 01', completed: false },
                                    { id: 2, title: 'Todo 02', completed: false },
                                    { id: 3, title: 'Todo 03', completed: false }];
    const expectedValue = ['Todo 02', 'Todo 03'];
    const expectedLocalStorageValue = [{ id: 2, title: 'Todo 02', completed: false },
                                       { id: 3, title: 'Todo 03', completed: false }];
    const firstTodo = 1;

    before(() => {
      return navigate.openHomePageAndNaviagteToEmberJsAppWithAddedTodos(listOfPreExistingTodos)
              .then(emberJsPage.clickCloseIcon(firstTodo));
    });

    it('Should match the undeleted todos value', () => {
      return emberJsPage.getNamesOfTodosInTheList()()
      .then(todos => (expect(todos).to.deep.equal(expectedValue)));
    });

    it('Should change localStorage', () => {
      return expect(emberJsPage.getLocalStorageValue()).to.eventually.deep.equal(expectedLocalStorageValue);
    });
  });

  describe('I can clear all completed Todo items from the list completely', () => {
    const listOfPreExistingTodos = [{ id: 1, title: 'Todo 01', completed: false },
                                    { id: 2, title: 'Todo 02', completed: true },
                                    { id: 3, title: 'Todo 03', completed: true },
                                    { id: 4, title: 'Todo 04', completed: false },
                                    { id: 5, title: 'Todo 05', completed: false }];
    const expectedValue = ['Todo 01', 'Todo 04', 'Todo 05'];
    const expectedLocalStorageValue = [{ id: 1, title: 'Todo 01', completed: false },
                                    { id: 4, title: 'Todo 04', completed: false },
                                    { id: 5, title: 'Todo 05', completed: false }];
    before(() => {
      return navigate.openHomePageAndNaviagteToEmberJsAppWithAddedTodos(listOfPreExistingTodos)
              .then(emberJsPage.clickClearCompleted());
    });

    it('Should match the uncleared todos value', () => {
      return emberJsPage.getNamesOfTodosInTheList()()
      .then(todos => (expect(todos).to.deep.equal(expectedValue)));
    });

    it('Should change localStorage', () => {
      return expect(emberJsPage.getLocalStorageValue()).to.eventually.deep.equal(expectedLocalStorageValue);
    });
  });
});
