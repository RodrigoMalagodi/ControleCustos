import { Component, OnInit } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-home-detalhes',
  templateUrl: './home-detalhes.component.html',
  styleUrls: ['./home-detalhes.component.scss'],
})
export class HomeDetalhesComponent implements OnInit {
  public diaAtual = new Date();
  public horaAtual: string = '';
  horaAtual$: Observable<any>;
  public lat;
  public lng;
  currentCity: string = '';
  currentState: string = '';
  public location: string = '';

  constructor(
    private localeService: BsLocaleService,
    private spinner: NgxSpinnerService,
    private homeService: HomeService
  ) {
    this.localeService.use('pt-br');
  }

  ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => {
      this.getLocation();
      this.spinner.hide();
    }, 3000);
    const setIntervalConst: ReturnType<typeof setInterval> = setInterval(() => {
      this.horaAtual = this.homeService.getDate();
    }, 1000);
  }

  getDateTime() {
    this.diaAtual.setSeconds(this.diaAtual.getSeconds() + 1);
    this.horaAtual =
      (this.diaAtual.getHours() < 10
        ? '0' + this.diaAtual.getHours()
        : this.diaAtual.getHours()) +
      ':' +
      (this.diaAtual.getMinutes() < 10
        ? '0' + this.diaAtual.getMinutes()
        : this.diaAtual.getMinutes()) +
      ':' +
      (this.diaAtual.getSeconds() < 10
        ? '0' + this.diaAtual.getSeconds()
        : this.diaAtual.getSeconds());
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          if (position) {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.homeService.getCurrentLocacion(this.lat, this.lng);

            if (localStorage.getItem('location')) {
              this.currentCity = JSON.parse(
                localStorage.getItem('location')!
              ).city.toString();

              this.currentState = JSON.parse(localStorage.getItem('location')!)
                .principalSubdivisionCode.toString()
                .split('-')[1];

              this.location = this.currentCity + ' - ' + this.currentState;
            }
          }
        },
        (error: GeolocationPositionError) => console.log(error)
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  formatDate(date: Date): any {
    return date.toISOString().slice(0, 10);
  }
}
