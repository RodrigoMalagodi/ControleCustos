import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Conta } from 'src/app/models/identity/Conta';
import { ContasService } from 'src/app/services/contas.service';
import { DashboardsService } from 'src/app/services/dashboards.service';

@Component({
  selector: 'app-tipo-fornecimento',
  templateUrl: './tipo-fornecimento.component.html',
  styleUrls: ['./tipo-fornecimento.component.scss']
})
export class TipoFornecimentoComponent implements OnInit {

  conta = {} as Conta;
  contas = [] as Conta[];
  form!: FormGroup;

  tipoFornecimento : string;
  dataInicio : Date;
  dataFim : Date;

  tipoFornecimentoCombo = [];

  constructor(
    private fb: FormBuilder,
    private dashBoardsService: DashboardsService,
    private contaService: ContasService,
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.localeService.use('pt-br');
  }

  get bsConfig(): any {
    return {
      adaptivePosition: true,
      isAnimated: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };
  }

  ngOnInit(): void {
    this.validationForm();
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }

  public get f(): any {
    return this.form.controls;
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return {
      'is-invalid': campoForm.errors && (campoForm.dirty || campoForm.touched),
    };
  }

  public validationForm(): void {
    this.form = this.fb.group({
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
    });
  }

  public gerarDados(): void {
    this.getDadosDashBoardTipoCusto();
  }

  getDadosDashBoardTipoCusto(): void {
    this.dashBoardsService
      .getDadosDashBoardTipoCusto(this.dataInicio, this.dataFim)
      .subscribe({
        next: (conta: Conta[]) => {
          this.contas = { ...conta };
          console.log(this.conta);
        },
        error: (error: any) => {
          console.log(error), this.spinner.hide();
          this.toastr.error('Erro ao carregar os dados.', 'Erro');
        },
      })
      .add(() => this.spinner.hide());
  }

}
