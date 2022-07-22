import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-titulo',
  templateUrl: './titulo.component.html',
  styleUrls: ['./titulo.component.scss']
})
export class TituloComponent implements OnInit {

  @Input() tituloPagina: string = '';
  @Input() subtituloPagina: string = 'Desde 2021';
  @Input() iconClass: string = 'fa-solid fa-circle-user';
  @Input() botaoListar = false;
  @Input() eventoListar: string = '';
  constructor(private router: Router) { }

  public listar(): void {
    this.router.navigate([`/${this.tituloPagina.toLocaleLowerCase()}/lista`]);
  }

  ngOnInit(): void {

  }

}
