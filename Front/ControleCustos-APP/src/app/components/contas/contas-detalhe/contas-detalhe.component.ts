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
import { ContasService } from 'src/app/services/contas.service';
import { FornecedoresService } from 'src/app/services/fornecedores.service';
import { FornecedoresDetalhesComponent } from '../../fornecedores/fornecedores-detalhes/fornecedores-detalhes.component';

@Component({
  selector: 'app-contas-detalhe',
  templateUrl: './contas-detalhe.component.html',
  styleUrls: ['./contas-detalhe.component.scss'],
})
export class ContasDetalheComponent implements OnInit {
  modalRef?: BsModalRef;
  contaId: number;
  acaoSalvar = 'post';
  conta = {} as Conta;
  contas = [] as Conta[];
  form!: FormGroup;
  fornecedorId: number;
  fornecedores = [] as Fornecedor[];
  fornecedoresCombo = [];
  public rota: string;
  public cadastroViaFornecedor: boolean = false;

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activedRouter: ActivatedRoute,
    private contaService: ContasService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
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

  formatDate(date: Date): any {
    return date.toISOString().slice(0, 10);
  }

  public get f(): any {
    return this.form.controls;
  }

  get modoEditar(): boolean {
    return this.acaoSalvar == 'put';
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

  ngOnInit(): void {
    this.spinner.show();
    this.validationConta();
    setTimeout(() => {
      this.fornecedorId = parseInt(localStorage.getItem('fornecedorId'));
    }, 3000);
    this.fornecedoresCombo = [];
    this.getFornecedorAtivos();
    this.getContaById();
  }

  public getContaById(): void {
    this.contaId = +this.activedRouter.snapshot.paramMap.get('id');
    if (this.contaId != null && this.contaId != 0) {
      this.acaoSalvar = 'put';
      this.contaService
        .getContaById(this.contaId)
        .subscribe({
          next: (conta: Conta) => {
            this.conta = { ...conta };
            this.form.patchValue(this.conta);
            console.log(this.conta);
          },
          error: (error: any) => {
            console.log(error), this.spinner.hide();
            this.toastr.error('Erro ao carregar a conta.', 'Erro');
          },
        })
        .add(() => this.spinner.hide());
    }
  }

  public getFornecedorAtivos() {
    this.fornecedorService.getFornecedorAtivos().subscribe({
      next: (fornecedor: Fornecedor[]) => {
        this.fornecedores = { ...fornecedor };

        this.criarFornecedorCombo(this.fornecedores);
        console.log(this.fornecedoresCombo);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  criarFornecedorCombo(fornecedores: Fornecedor[]): any {
    Object.entries(fornecedores).forEach(([key, value], index) => {
      this.fornecedoresCombo = [];
      for (let key in this.fornecedores) {
        let fornecedor = this.fornecedores[key];
        this.fornecedoresCombo.push({
          fornecedorId: fornecedor.fornecedorId,
          nome: fornecedor.nome,
        });
      }
      if (this.cadastroViaFornecedor) {
        this.form = this.fb.group({
          fornecedorId: [`${this.fornecedorId}`],
        });
      }
    });
  }

  public validationConta(): void {
    this.form = this.fb.group({
      descricao: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(150),
        ],
      ],
      fornecedorId: ['', Validators.required],
      tipoCusto: ['', Validators.required],
      valor: [0, [Validators.required]],
      juros: [0],
      dataVencimento: ['', Validators.required],
      dataPagamento: [''],
    });
  }

  public mudarValorData(value: Date, campo: string): void {
    this.conta[campo] = value;
  }

  public salvarConta(): any {
    this.rota = '';
    // this.cadastroViaFornecedor = false;
    if (this.form.valid) {
      this.spinner.show();
      this.acaoSalvar === 'post'
        ? (this.conta =
            this.cadastroViaFornecedor == true
              ? { ...this.form.value }
              : { fornecedorId: this.fornecedorId, ...this.form.value })
        : (this.conta = {
            contaId: this.conta.contaId,
            ...this.form.value,
          });

      this.contaService[this.acaoSalvar](this.conta)
        .subscribe({
          next: (contaRetorno: Conta) => {
            this.toastr.success('Conta salva com sucesso.', 'Sucesso');
            this.router.navigate([this.rota]);
            console.log(contaRetorno);
          },
          error: (error: any) => {
            console.log(error);
            this.toastr.error(
              `Falha ao tentar salvar a Conta: ${error}`,
              'Erro!'
            );
          },
        })
        .add(() => this.spinner.hide());
    }
  }
}
