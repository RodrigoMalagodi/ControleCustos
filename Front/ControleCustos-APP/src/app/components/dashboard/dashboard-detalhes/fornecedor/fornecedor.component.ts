import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Conta } from 'src/app/models/identity/Conta';
import { Fornecedor } from 'src/app/models/identity/Fornecedor';
import { DashboardsService } from 'src/app/services/dashboards.service';
import { FornecedoresService } from 'src/app/services/fornecedores.service';

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.scss'],
})
export class FornecedorComponent implements OnInit {
  conta = {} as Conta;
  contas = [] as Conta[];
  form!: FormGroup;

  fornecedorId: number;
  fornecedores = [] as Fornecedor[];

  dataInicio: Date;
  dataFim: Date;

  constructor(
    private fb: FormBuilder,
    private dashBoardsService: DashboardsService,
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private fornecedorService: FornecedoresService
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
      fornecedorId: [0, Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
    });
  }

  public gerarDados(): void {
    this.getDadosDashBoardFornecedorId();
  }

  getDadosDashBoardFornecedorId(): void {
    this.dashBoardsService
      .getDadosDashBoardFornecedorId(
        this.fornecedorId,
        this.dataInicio,
        this.dataFim
      )
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
