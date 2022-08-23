import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserLogin } from 'src/app/models/identity/UserLogin';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  model = {} as UserLogin;

  frmLogin!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  public login() {
    this.spinner.show();
    this.accountService
      .login(this.model)
      .subscribe(
        () => {
          this.router.navigateByUrl('/home');
          this.toastr.success('Usuário logado com sucesso.', 'Sucesso!');
        },
        (error: any) => {
          if (error.status === 401) {
            this.toastr.error(error.error, 'Erro!');
          } else {
            this.toastr.error('Usuário ou Senha inválido.', 'Erro!');
            console.log(error);
          }
          this.spinner.hide();
        }
      )
      .add(() => this.spinner.hide());
  }

  ngOnInit(): void {
    this.spinner.show();
    setInterval(() => {
      this.spinner.hide();
    }, 3000);

    var user = localStorage.getItem('user');
    if (!user) localStorage.clear();
  }
}
