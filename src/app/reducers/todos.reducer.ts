import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, Action, on } from '@ngrx/store';
import * as actions from '../actions/todo-item.actions';


export interface TodoEntity {
  id: string;
  name: string;
  dueDate?: string;
  project?: string;

}

export interface TodosState extends EntityState<TodoEntity> {

}

export const adapter = createEntityAdapter<TodoEntity>();

// const initialState = adapter.getInitialState();
const initialState: TodosState = {
  ids: ['1', '2'],
  entities: {
    1: { id: '1', name: 'Make Tacos' },
    2: { id: '2', name: 'Clean Garage', project: 'Home' },
    3: { id: '3', name: 'Eat Tacos', dueDate: '2021-06-15T20:39:47.000Z' },
    4: { id: '4', name: 'Make Love', project: 'Fitness', dueDate: '2021-05-15T20:39:47.000Z' }
  }
};

const reducerFunction = createReducer(
  initialState,
  on(actions.todoItemAdded, (state, action) => adapter.addOne(action.payload, state))
);

export function reducer(state: TodosState = initialState, action: Action): TodosState {
  return reducerFunction(state, action);
}



