import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Conta } from 'src/app/models/identity/Conta';
import { ContasService } from 'src/app/services/contas.service';

@Component({
  selector: 'app-home-detalhes',
  templateUrl: './home-detalhes.component.html',
  styleUrls: ['./home-detalhes.component.scss'],
})
export class HomeDetalhesComponent implements OnInit {
  public diaAtual = new Date();

  constructor(
    private contaService: ContasService,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activedRouter: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.localeService.use('pt-br');
  }

  ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => {

      this.spinner.hide();
    }, 3000);
  }


  formatDate(date: Date): any {
    return date.toISOString().slice(0, 10);
  }


}
