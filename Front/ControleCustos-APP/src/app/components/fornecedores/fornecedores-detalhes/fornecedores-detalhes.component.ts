import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Fornecedor } from 'src/app/models/identity/Fornecedor';
import { FornecedoresService } from 'src/app/services/fornecedores.service';

@Component({
  selector: 'app-fornecedores-detalhes',
  templateUrl: './fornecedores-detalhes.component.html',
  styleUrls: ['./fornecedores-detalhes.component.scss'],
})
export class FornecedoresDetalhesComponent implements OnInit {

  public fornecedor: Fornecedor;

  constructor(
    private fornecedorService: FornecedoresService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  public getFornecedorById(fornecedorId: number): void {
    this.spinner.show();
    this.fornecedorService
      .getFornecedorById(fornecedorId)
      .subscribe({
        next: (fornecedor: Fornecedor) => {
          this.fornecedor = { ...fornecedor };
        },
        error: (error: any) => {
          console.log(error), this.spinner.hide();
          this.toastr.error('Erro ao carregar o fornecedor.', 'Erro');
        },
      })
      .add(() => this.spinner.hide());
  }
}
