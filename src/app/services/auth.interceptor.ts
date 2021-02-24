import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, selectIsLoggedIn } from '../reducers';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  isLoggedIn: boolean;
  token: string;
  constructor(store: Store<AppState>) {
    store.select(selectIsLoggedIn).subscribe((on) => this.isLoggedIn = on);

    // don't actually query state of components in stuff like this select(s=>s.token).
    // write a function for it. This can just be used to see if it works
    store.select(s => s.auth.token).subscribe(token => this.token = token);

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if the url is for the api and not for the authUrl (auth/login), and the user is logged in
    if (req.url !== environment.apiUrl + 'auth/token' && this.isLoggedIn && req.url.startsWith(environment.apiUrl)) {
      // then attach a new authorization header with the bearer token from the store to the request
      // challenge: you are not allowed to change the request (the req variable in the params list).
      // you have to take that and create a whole new request
      const newHeaders = req.headers.append('Authorization', 'Bearer ' /*note the space at end of 'Bearer '*/ + this.token);
      const authRequest = req.clone({ headers: newHeaders });
      return next.handle(authRequest);
    } else {
      // pass that new request (or the original one if it didn't meet the preconditions) to the next interceptor
      return next.handle(req);
    }



  }

}
