import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from '../models/identity/User';
import { AccountService } from '../services/account.service';
import { catchError, take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let _currentUser: User;

    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      _currentUser = user;

      if (_currentUser) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${_currentUser.token}`,
          },
        });
      }
    });

    return next.handle(request).pipe(
      catchError(error => {
        if(error){
          // localStorage.removeItem('user')
        }
        return throwError(error);
      })
    );
  }
}
