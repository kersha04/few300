import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as actions from '../actions/todo-item.actions';
import { TodosDataService } from '../services/todos-data-service';

@Injectable()
export class TodosEffects {

  // loadTodos => (go to the api) => (loadTodosSucceeded | loadTodosFailed)
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.loadTodos),
      switchMap(() => this.service.getAllTodos()
        .pipe(
          map(payload => actions.loadTodosSucceeded({ payload })),
          catchError((e) => of(actions.loadTodosFailed({ errorMessage: 'Something bad happened' })))
        )
      )
    ), { dispatch: true });

  constructor(
    private actions$: Actions,
    private service: TodosDataService
  ) { }
}
