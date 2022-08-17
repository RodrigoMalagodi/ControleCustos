import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ValidatorField } from 'src/app/helpers/ValidatorField';
import { UserUpdate } from 'src/app/models/identity/UserUpdate';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-perfil-detalhe',
  templateUrl: './perfil-detalhe.component.html',
  styleUrls: ['./perfil-detalhe.component.scss'],
})
export class PerfilDetalheComponent implements OnInit {
  userUpdate = {} as UserUpdate;

  @Output() changeFormValue = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.validarFormPerfil();
    this.carregarUsuario();
    this.verficaForm();
  }
  private verficaForm(): void {
    this.frmPerfil.valueChanges.subscribe(
      ()=> this.changeFormValue.emit({... this.frmPerfil.value})
    );
  }

  frmPerfil!: FormGroup;

  public get f() {
    return this.frmPerfil.controls;
  }

  onSubmit(): void {
    this.atualizarUsuario();
  }

  public atualizarUsuario() : any{
    this.userUpdate = { ...this.frmPerfil.value };
    this.spinner.show();

    this.accountService
      .updateUser(this.userUpdate)
      .subscribe({
      next: () => {
        this.toastr.success('Usuário atualizado com sucesso.', 'Sucesso!');
      },
      error: (error: any) => {
        console.log(error);
        this.toastr.error(
          `Erro ao atualizar o usuário. Erro: ${error}`,
          'Erro!'
        );
      }
    })
    .add(() => this.spinner.hide());
  }

  private carregarUsuario(): void {
    this.spinner.show();
    this.accountService
      .getUser()
      .subscribe({
        next: (userRetorno: UserUpdate) => {
          console.log(userRetorno);
          this.userUpdate = userRetorno;
          this.frmPerfil.patchValue(this.userUpdate);
          this.toastr.success(
            'Dados do usuário carregado com sucesso.',
            'Sucesso!'
          );
        },
        error: (error: any) => {
          this.toastr.error('Erro ao carregar os dados do usuário.', 'Erro!');
          this.router.navigate(['/dashboard']);
        },
      })
      .add(() => this.spinner.hide());
  }

  validarFormPerfil() {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmePassword'),
    };

    this.frmPerfil = this.fb.group(
      {
        userName: [''],
        nome: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(30),
          ],
        ],

        imagemURL: [''],
        phoneNumber: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [''],
        confirmePassword: [''],
      },
      formOptions
    );
  }

  public resetFrmPerfil(event: any): void {
    event.preventDefault();
    this.frmPerfil.reset();
  }
}
