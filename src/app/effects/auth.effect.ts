import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment'; // we don't import for prod ever, just this one
import * as authActions from '../actions/auth.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { dispatch } from 'rxjs/internal/observable/pairs';

// anything outside the realm of our application (like, calling db, api etc) be effects
@Injectable()
export class AuthEffects {

  readonly baseUri = environment.apiUrl;

  // loginSucceeded => change the route => do nothing else
  loginSucceeded = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginSucceeded),
      // tap just means do this thing. it used to be called do, in fact
      tap(() => this.router.navigate(['dashboard']))
    ),
    { dispatch: false }
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginRequested),
      switchMap(request => this.client.post<{ access_token: string }>(this.baseUri + 'auth/login', {
        username: request.username,
        password: request.password
      }).pipe(
        map(response => authActions.loginSucceeded({ username: request.username, token: response.access_token })),
        catchError(() => of(authActions.loginFailed({ reason: 'Sorry, but no' })))
      ))
    ), { dispatch: true }
  );

  constructor(
    private actions$: Actions,
    private client: HttpClient,
    private router: Router
  ) { }
}
