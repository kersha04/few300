import { ActionReducerMap, createSelector } from '@ngrx/store';
import * as fromTodos from './todos.reducer';
import * as models from '../models/todos.models';

export interface AppState {
  todos: fromTodos.TodosState;
}

export const reducers: ActionReducerMap<AppState> = {
  todos: fromTodos.reducer
};

// 1 - Feature Select (done, not in a feature. we're in root)

// 2 - One per branch on the state (right now, we have one called 'Todos')
const selectTodosBranch = (state: AppState) => state.todos;

// 3 - Any helpers (not usually exported)
const { selectAll: selectAllTodoArray } = fromTodos.adapter.getSelectors(selectTodosBranch);

const selectTodoItemsListModel = createSelector(
  selectAllTodoArray,
  (todos) => todos as models.TodoListItem[]
);

// 4 - What your components need
export const selectInboxItems = createSelector(
  selectTodoItemsListModel,
  items => items.filter(item => !item.dueDate && !item.project)
);

export const selectNumberOfInboxItems = createSelector(
  selectInboxItems,
  items => items.length
);
