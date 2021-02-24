import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, Action, on } from '@ngrx/store';
import * as actions from '../actions/todo-item.actions';


export interface TodoEntity {
  id: string;
  name: string;
  dueDate?: string;
  project?: string;
  completed: boolean;

}

export interface TodosState extends EntityState<TodoEntity> {

}

export const adapter = createEntityAdapter<TodoEntity>();

const initialState = adapter.getInitialState();

const reducerFunction = createReducer(
  initialState,
  on(actions.todoItemAdded, (state, action) => adapter.addOne(action.payload, state)),
  on(actions.todoItemMarkedComplete, actions.todoItemMarkedIncomplete,
    (state, action) => adapter.updateOne({
      id: action.item.id,
      changes: { completed: !action.item.completed }
    }, state)),
  // set all - if there is something there already, replace it. We have a new state, folks
  on(actions.loadTodosSucceeded, (state, action) => adapter.setAll(action.payload, state))
);

export function reducer(state: TodosState = initialState, action: Action): TodosState {
  return reducerFunction(state, action);
}



