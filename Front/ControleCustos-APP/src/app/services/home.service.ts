import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  location$: Observable<any>;
  public lat;
  public lng;
  constructor(private http: HttpClient) {}

  date = new Date();
  public currentDate = '';

  getDate() {
    return this.getDateTime();
  }

  private getDateTime() {
    this.date.setSeconds(this.date.getSeconds() + 1);
    return (
      (this.date.getHours() < 10
        ? '0' + this.date.getHours()
        : this.date.getHours()) +
      ':' +
      (this.date.getMinutes() < 10
        ? '0' + this.date.getMinutes()
        : this.date.getMinutes()) +
      ':' +
      (this.date.getSeconds() < 10
        ? '0' + this.date.getSeconds()
        : this.date.getSeconds())
    );
  }

  public getCurrentLocacion(lat: any, lng: any) {
    return this.http
      .get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      )
      .subscribe((res: any[]) => {
        console.log(res);
        localStorage.setItem('location', JSON.stringify(res));
        this.lat = JSON.parse(
          localStorage.getItem('location')!
        ).latitude.toString();
        this.lng = JSON.parse(
          localStorage.getItem('location')!
        ).longitude.toString();
      });
  }
}
