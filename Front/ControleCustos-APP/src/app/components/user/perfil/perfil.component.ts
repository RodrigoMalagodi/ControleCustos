import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserUpdate } from 'src/app/models/identity/UserUpdate';
import { AccountService } from 'src/app/services/account.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  userUpdate = {} as UserUpdate;
  public imagemURL: string = 'assets/img/default_user.png';
  public file: File;

  constructor(
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private accountService: AccountService
  ) {}

  ngOnInit() {}

  public setFormValue(usuario: UserUpdate): void {
    this.userUpdate = usuario;
    if (this.userUpdate.imagemURL) {
      this.imagemURL = `${environment.apiURL}/resources/images/users/${this.userUpdate.imagemURL}`;
    }
    else{
      this.imagemURL = 'assets/img/default_user.png';
    }
  }

  public onFileChange(ev: any): void {
    const reader = new FileReader();
    reader.onload = (event: any) => (this.imagemURL = event.target.result);

    this.file = ev.target.files;
    reader.readAsDataURL(this.file[0]);
    this.uploadImage();
  }

  private uploadImage(): void {
    this.spinner.show();
    this.accountService
      .postUpload(this.file)
      .subscribe({
        next: () => {
          this.toaster.success('Imagem atualizada com sucesso!', 'Sucesso!');
        },
        error: (error: any) => {
          this.toaster.error('Erro ao realizar upload de imagem.', 'Erro!');
          console.log(error);
        },
      })
      .add(() => this.spinner.hide());
  }
}
