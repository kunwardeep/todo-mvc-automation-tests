# todo-mvc-automation-tests
#### Automate the following scenarios for the Todo Mvc at http://todomvc.com/examples/emberjs/#/

1. I want to add a Todo item
2. I want to edit the content of an existing Todo item
3. I can complete a Todo by clicking inside the circle UI to the left of the Todo
4. I can re-activate a completed Todo by clicking inside the circle UI
5. I can add a second Todo
6. I can complete all active Todos by clicking the down arrow at the top-left of the UI
7. I can filter the visible Todos by Completed state
8. I can clear a single Todo item from the list completely by clicking the Close icon
9. I can clear all completed Todo items from the list completely

## Running the tests
```
bin/ci_test.sh
```

## Issues
Tests currently not working
  On firefox -

    Scenario - I want to edit the content of an existing Todo item
          Test - Should match the edited todo value

          It is editing the text but for some strange reason the library is not able to send the enter keys. Under investigation.-

    Scenario - I can clear a single Todo item from the list completely by clicking the Close icon
        The scenario is failing(https://github.com/mozilla/geckodriver/issues/159) as to there is no implementation in firefox for the moveToObject command. Looking for alternate solution.-

Genuine failures.

    Scenario - I want to edit the content of an existing Todo item
          Test - Should update localStorage

          The app itself is not updating the local storage.
