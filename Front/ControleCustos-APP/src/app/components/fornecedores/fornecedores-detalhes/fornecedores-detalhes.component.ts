import { IfStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Conta } from 'src/app/models/identity/Conta';
import { Fornecedor } from 'src/app/models/identity/Fornecedor';
import { PaginatedResult, Pagination } from 'src/app/models/Pagination';
import { FornecedoresService } from 'src/app/services/fornecedores.service';
import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';
import { ContasDetalheComponent } from '../../contas/contas-detalhe/contas-detalhe.component';
import { TabHeadingDirective } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-fornecedores-detalhes',
  templateUrl: './fornecedores-detalhes.component.html',
  styleUrls: ['./fornecedores-detalhes.component.scss'],
})
export class FornecedoresDetalhesComponent implements OnInit {
  modalRef?: BsModalRef;
  acaoSalvar = 'post';
  fornecedor = {} as Fornecedor;
  contas = [] as Conta[];
  form!: FormGroup;
  public fornecedorId: number;
  public pagination = {} as Pagination;
  public rota: string;
  contasDetalhe: ContasDetalheComponent;

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activedRouter: ActivatedRoute,
    private fornecedorService: FornecedoresService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: BsModalService
  ) {
    this.localeService.use('pt-br');
  }

  public get f(): any {
    return this.form.controls;
  }

  get modoEditar(): boolean {
    return this.acaoSalvar == 'put';
  }

  ngOnInit(): void {
    this.validationFornecedor();
    this.getFornecedorById();

    this.pagination = {
      currentPage: 1,
      itemsPerPage: 3,
      totalItems: 1,
    } as Pagination;
  }

  public pageChanged(event): void {
    this.spinner.show();
    this.pagination.currentPage = event.page;
    setTimeout(() => {
      this.getFornecedorById();
      this.spinner.hide();
    }, 3000);
  }

  public validationFornecedor(): void {
    this.form = this.fb.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(150),
        ],
      ],
      tipoFornecimento: ['', Validators.required],
    });
  }

  public novaConta(cadastroViaFornecedor: boolean): void {
    this.spinner.show();
    localStorage.setItem(
      'cadastroViaFornecedor',
      cadastroViaFornecedor.toString()
    );

    setTimeout(() => {
      this.router.navigate(['contas/detalhe']);
    }, 3000);
  }

  public salvarFornecedor(): any {
    if (this.form.valid) {
      this.spinner.show();
      this.acaoSalvar === 'post'
        ? (this.fornecedor = { ...this.form.value })
        : (this.fornecedor = {
            fornecedorId: this.fornecedor.fornecedorId,
            ...this.form.value,
          });

      this.fornecedorService[this.acaoSalvar](this.fornecedor)
        .subscribe({
          next: (fornecedorRetorno: Fornecedor) => {
            this.toastr.success('Fornecedor salvo com sucesso.', 'Sucesso');
            this.router.navigate(['fornecedores/lista']);
          },
          error: (error: any) => {
            console.log(error);
            this.toastr.error(
              `Falha ao tentar salvar o Fornecedor: ${error}`,
              'Erro!'
            );
          },
        })
        .add(() => this.spinner.hide());
    }
  }

  public getFornecedorById(): void {
    this.fornecedorId = +this.activedRouter.snapshot.paramMap.get('id');
    if (this.fornecedorId != null && this.fornecedorId != 0) {
      localStorage.removeItem('fornecedorId');
      localStorage.setItem('fornecedorId', this.fornecedorId.toString());
      this.spinner.show();
      this.acaoSalvar = 'put';
      this.fornecedorService
        .getFornecedorById(this.fornecedorId)
        .subscribe({
          next: (fornecedor: Fornecedor) => {
            this.fornecedor = { ...fornecedor };
            this.form.patchValue(this.fornecedor);
            if (this.fornecedor != null) {
              setTimeout(() => {
                this.getContasFornecedorId(this.fornecedorId);
              }, 3000);
            }
          },
          error: (error: any) => {
            console.log(error), this.spinner.hide();
            this.toastr.error('Erro ao carregar o fornecedor.', 'Erro');
          },
        })
        .add(() => this.spinner.hide());
    }
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

  public getContasFornecedorId(fornecedorId: number) {
    this.spinner.show();
    this.fornecedorService
      .getContasByFornecedorId(
        this.fornecedorId,
        this.pagination.currentPage,
        this.pagination.itemsPerPage
      )
      .subscribe({
        next: (paginatedResult: PaginatedResult<Conta[]>) => {
          this.spinner.show();
          this.contas = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
          this.form.patchValue(this.contas);
        },
        error: (error: any) => {
          console.log(error), this.spinner.hide();
          this.toastr.error('Erro ao carregar o fornecedor.', 'Erro');
        },
      })
      .add(() => this.spinner.hide());
  }

  public classDiasAtraso(valor: number): string {
    return valor > 0 ? 'valorMenorQueZero' : 'valorMaiorQueZero';
  }

  public classJuros(valor: number): string {
    return valor > 0 ? 'valorMenorQueZero' : '';
  }
}
