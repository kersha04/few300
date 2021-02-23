import { isNgTemplate } from '@angular/compiler';
import { createAction, props } from '@ngrx/store';
import { TodoCreate } from '../models';
import { TodoEntity } from '../reducers/todos.reducer';

let fakeId = 1;
// "Initiator"
// name, dueDate?, project?

export const todoItemAdded = createAction(
  '[app] todo item added',
  ({ item }: { item: TodoCreate }) => ({
    payload: {
      ...item,
      id: 'T' + fakeId++,
      completed: false
    } as TodoEntity
  })
);

export const todoItemMarkedComplete = createAction(
  '[app] todo item marked complete',
  props<{ item: TodoEntity }>()
);

export const todoItemMarkedIncomplete = createAction(
  '[app] todo item marked incomplete',
  props<{ item: TodoEntity }>()
);



// "Happy Path"
// -> after going to the API, dispatch an action that says "Hey, you know that one with the fake id of Txx?"
//    replace it with this real one from the server.

// "Errors"
// -> after going to the API, I got an error. Admit your lie. Remove that sucker from the state. And maybe
//    tell the user about it.
