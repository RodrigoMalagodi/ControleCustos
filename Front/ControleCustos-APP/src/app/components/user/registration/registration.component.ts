import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs';

import { ValidatorField } from 'src/app/helpers/ValidatorField';
import { User } from 'src/app/models/identity/User';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  user = {} as User;
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  public get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.spinner.show();
    this.validarRegistro();
    setInterval(() => {
      this.spinner.hide();
    }, 2000);

  }

  private validarRegistro(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmePassword'),
    };

    this.form = this.fb.group(
      {
        nome: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(25),
          ],
        ],
        userName: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(50),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmePassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      formOptions
    );
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return {
      'is-invalid': campoForm.errors && (campoForm.dirty || campoForm.touched),
    };
  }

  public registrar(): void {
    this.spinner.show();
    this.user = {
      ...this.form.value,
    };

    this.accountService
      .register(this.user)
      .subscribe(
        () => {
          this.router.navigateByUrl('/home');
        },
        (error: any) => {
          if (error.status === 401) {
            console.log(error);
          } else {
            this.toastr.error('Usuário ou Senha inválido.', 'Erro');
            console.log(error);
          }
          this.spinner.hide();
        }
      )
      .add(() => this.spinner.hide());
  }
}
