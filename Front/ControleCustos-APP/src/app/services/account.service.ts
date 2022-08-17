import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { User } from '../models/identity/User';
import { environment } from 'src/environments/environment';
import { UserUpdate } from '../models/identity/UserUpdate';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  getUser(): Observable<UserUpdate> {
    return this.http.get<UserUpdate>(this.baseURL + '/getUser').pipe(take(1));
  }

  updateUser(model: UserUpdate): Observable<void> {
    return this.http.put<UserUpdate>(this.baseURL + '/updateUser', model).pipe(
      take(1),
      map((user: UserUpdate) => {
        this.setCurrentUser(user);
      })
    );
  }

  private currentUserSource = new ReplaySubject<User>(1);
  public currentUser$ = this.currentUserSource.asObservable();

  baseURL = environment.apiURL + '/api/account';
  public userLog: string = '';

  constructor(private http: HttpClient) {}

  public login(model: any): Observable<void> {
    return this.http.post<User>(this.baseURL + '/login', model).pipe(
      take(1),
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
          console.log(user);
        }
      })
    );
  }

  public register(model: any): Observable<void> {
    return this.http.post<User>(this.baseURL + '/register', model).pipe(
      take(1),
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource = new ReplaySubject<User>();
    this.currentUserSource.complete();
  }

  public setCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
    this.userLog = JSON.parse(
      localStorage.getItem('user')!
    ).nome.toString();
  }

  public postUpload(file: File): Observable<UserUpdate> {
    const fileToUpload = file[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);
    return this.http.post<UserUpdate>(
      `${this.baseURL}/upload-image`,
      formData
    ).pipe(take(1));
  }
}
