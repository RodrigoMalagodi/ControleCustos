import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-detalhes-mapa',
  templateUrl: './home-detalhes-mapa.component.html',
  styleUrls: ['./home-detalhes-mapa.component.scss']
})
export class HomeDetalhesMapaComponent implements OnInit {

  constructor() {}
    ngOnInit(): void {}
    display: any;
    center: google.maps.LatLngLiteral = {
        lat: -23.434877,
        lng: -46.722527
    };
    zoom = 4;
    moveMap(event: google.maps.MapMouseEvent) {
        if (event.latLng != null) this.center = (event.latLng.toJSON());
    }
    move(event: google.maps.MapMouseEvent) {
        if (event.latLng != null) this.display = event.latLng.toJSON();
    }

}
