import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment'; // we don't import for prod ever, just this one
import * as authActions from '../actions/auth.actions';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
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

  // loginSucceeded => write the token and the expiration into the local storage => nothing (dispatch false)
  loginSucceededSaveToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginSucceeded),
      tap(a => {
        localStorage.setItem('token', a.token);
        const tokenData = JSON.parse(atob(a.token.split('.')[1])) as { exp: number, username: string };
        const date = new Date();
        date.setUTCSeconds(tokenData.exp);
        localStorage.setItem('token-expire', JSON.stringify(date));
        localStorage.setItem('username', tokenData.username);
      })
    ), { dispatch: false });

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.logOutRequested),
      tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('token-expire');
        localStorage.removeItem('username');
      })
    ), { dispatch: false });

  logoutSendsToLogin$ = createEffect(() =>
    this.actions$.pipe(ofType(authActions.logOutRequested),
      tap(() => this.router.navigate(['login'])))
    , { dispatch: false });

  checkForCredentials$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.checkForCredentials),
      map(() => {
        const expire = localStorage.getItem('token-expire');
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');
        if (expire && username && token) {
          const expireDate = new Date(JSON.parse(expire));
          if (expireDate > new Date()) {
            return ({ expire, username, token });
          } else { return null; }
        } else { return null; }
      }),
      filter((t: { expire: string; username: string, token: string }) => t !== null),
      map(t => authActions.loginSucceeded({ username: t.username, token: t.token }))
    ), { dispatch: true });

  constructor(
    private actions$: Actions,
    private client: HttpClient,
    private router: Router
  ) { }
}
