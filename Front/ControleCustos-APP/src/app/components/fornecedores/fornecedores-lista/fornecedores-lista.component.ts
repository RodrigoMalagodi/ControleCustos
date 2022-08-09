import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Fornecedor } from 'src/app/models/identity/Fornecedor';
import { PaginatedResult, Pagination } from 'src/app/models/Pagination';
import { FornecedoresService } from 'src/app/services/fornecedores.service';
import { debounceTime } from 'rxjs/operators';
import { Contas } from 'src/app/models/identity/Contas';

@Component({
  selector: 'app-fornecedores-lista',
  templateUrl: './fornecedores-lista.component.html',
  styleUrls: ['./fornecedores-lista.component.scss'],
})
export class FornecedoresListaComponent implements OnInit {
  constructor(
    private fornecedoresService: FornecedoresService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  modalRef?: BsModalRef;
  public fornecedores: Fornecedor[] = [];
  public contas: Contas[] = [];
  public fornecedor = {} as Fornecedor;
  public pagination = {} as Pagination;
  public fornecedorSituacao: boolean;

  private acaoSalvar: string = '';
  public nomeFornecedor: string = '';
  public fornecedorId: number = 0;
  public widthImg: number = 150;
  public marginImg: number = 2;
  public showImg: boolean = true;

  termoBuscaChanged: Subject<string> = new Subject<string>();

  ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 5,
      totalItems: 1,
    } as Pagination;
    this.spinner.show();
    setTimeout(() => {
      this.carregarFornecedores();
    }, 3000);
  }

  public filtrarFornecedor(evt: any): void {
    if (this.termoBuscaChanged.observers.length == 0) {
      this.termoBuscaChanged
        .pipe(debounceTime(1500))
        .subscribe((filtrarPor) => {
          this.spinner.show();
          this.fornecedoresService
            .getFornecedores(
              this.pagination.currentPage,
              this.pagination.itemsPerPage,
              filtrarPor
            )
            .subscribe({
              next: (paginatedResult: PaginatedResult<Fornecedor[]>) => {
                this.fornecedores = paginatedResult.result;
                this.pagination = paginatedResult.pagination;
              },
              error: (error: any) => {
                this.spinner.hide();
                this.toastr.error('Erro ao Carregar os Fornecedors', 'Erro!');
              },
              complete: () => {
                setTimeout(() => {
                  this.spinner.hide();
                }, 3000);
              },
            });
        });
    }
    this.termoBuscaChanged.next(evt.value);
  }

  public carregarFornecedores(): void {
    this.fornecedoresService
      .getFornecedores(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe({
        next: (paginatedResult: PaginatedResult<Fornecedor[]>) => {
          this.spinner.show();
          this.fornecedores = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
          console.log(this.fornecedores);
        },
        error: (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao Carregar os Fornecedores', 'Erro!');
        },
        complete: () => {
          setTimeout(() => {
            this.spinner.hide();
          }, 3000);
        },
      });
  }

  public pageChanged(event): void {
    this.pagination.currentPage = event.page;
    this.carregarFornecedores();
  }

  public openModal(
    event: any,
    template: TemplateRef<any>,
    fornecedorId: number,
    nomeFornecedor: string,
    situacao: boolean
  ) {
    event.stopPropagation();
    this.fornecedorId = fornecedorId;
    this.nomeFornecedor = nomeFornecedor;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.fornecedorSituacao = !situacao;
    console.log(this.fornecedorSituacao);
    this.fornecedoresService.situacaoFornecedor = this.fornecedorSituacao;
  }

  public confirmaAtualizacaoFornecedor(): void {
    this.modalRef?.hide();
    this.spinner.show();
    this.acaoSalvar = 'putSituacao';

    this.fornecedor = {
      fornecedorId: this.fornecedorId,
      ativo: this.fornecedorSituacao, ...this.fornecedor
    };

    this.fornecedoresService[this.acaoSalvar](this.fornecedor).subscribe({
      next: (result: any) => {
        this.toastr.success(
          'O Fornecedor foi atualizado com sucesso!',
          'Atualizado!'
        );
        this.spinner.hide();
        this.carregarFornecedores();
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error(
          `Erro ao Atualizar o Fornecedor ${this.nomeFornecedor}`,
          'Erro!'
        );
        console.log(error);
      },
      complete: () => {
        setTimeout(() => {
          this.spinner.hide();
        }, 3000);
      },
    });
  }

  public decline(): void {
    this.modalRef?.hide();
  }

  public detalheFornecedor(id: number): void {
    this.router.navigate([`fornecedores/detalhe/${id}`]);
  }

  public classButtonFornecedor(ativo: boolean): string {
    return ativo ? 'btn btn-sm btn-danger' : 'btn btn-sm btn-success';
  }

  public classIconButtonFornecedor(ativo: boolean): string {
    return ativo ? 'fa-solid fa-rectangle-xmark' : 'fa-solid fa-square-check';
  }

  public textoButton(ativo: boolean): string{
    return ativo ? "Desativar" : "Ativar"
  }
}
