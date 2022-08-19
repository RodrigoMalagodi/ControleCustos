import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Conta } from 'src/app/models/identity/Conta';
import { Fornecedor } from 'src/app/models/identity/Fornecedor';
import { PaginatedResult, Pagination } from 'src/app/models/Pagination';
import { ContasService } from 'src/app/services/contas.service';
import { FornecedoresService } from 'src/app/services/fornecedores.service';
import { ContasDetalheComponent } from '../contas-detalhe/contas-detalhe.component';

@Component({
  selector: 'app-contas-lista',
  templateUrl: './contas-lista.component.html',
  styleUrls: ['./contas-lista.component.scss'],
})
export class ContasListaComponent implements OnInit {
  constructor(
    private contasService: ContasService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private fornecedorService: FornecedoresService
  ) {}

  modalRef?: BsModalRef;
  public contas: Conta[] = [];
  public conta = {} as Conta;
  public fornecedor: Fornecedor[] = [];
  public pagination = {} as Pagination;
  public contaSituacao: boolean;
  public cadastroViaFornecedor: boolean = false;
  public contasDetalhe: ContasDetalheComponent;

  private acaoSalvar: string = '';
  public nomeFornecedor: string = '';
  public contaId: number = 0;
  public widthImg: number = 150;
  public marginImg: number = 2;
  public showImg: boolean = true;
  public rota: string;

  termoBuscaChanged: Subject<string> = new Subject<string>();

  ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 5,
      totalItems: 1,
    } as Pagination;
    this.spinner.show();
    setTimeout(() => {
      this.carregarContas();
    }, 3000);
  }

  public novaConta(rotaSalvar: string, cadastroViaFornecedor: boolean): void{
    this.rota = rotaSalvar;
    this.router.navigate(['contas/detalhe']);
  }

  public filtrarConta(evt: any): void {
    if (this.termoBuscaChanged.observers.length == 0) {
      this.termoBuscaChanged
        .pipe(debounceTime(1500))
        .subscribe((filtrarPor) => {
          this.spinner.show();
          this.contasService
            .getContas(
              this.pagination.currentPage,
              this.pagination.itemsPerPage,
              filtrarPor
            )
            .subscribe({
              next: (paginatedResult: PaginatedResult<Conta[]>) => {
                this.contas = paginatedResult.result;
                this.pagination = paginatedResult.pagination;
              },
              error: (error: any) => {
                this.spinner.hide();
                this.toastr.error('Erro ao Carregar as Contas', 'Erro!');
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

  public carregarContas(): void {
    this.contasService
      .getContas(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe({
        next: (paginatedResult: PaginatedResult<Conta[]>) => {
          this.spinner.show();
          this.contas = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
          console.log(this.contas);
        },
        error: (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao Carregar as Contas', 'Erro!');
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
    this.carregarContas();
  }

  public detalheConta(contaId: number): void {
    this.router.navigate([`contas/detalhe/${contaId}`]);
  }

  public openModal(
    event: any,
    template: TemplateRef<any>,
    contaId: number,
  ) {
    event.stopPropagation();
    this.contaId = contaId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  public confirmaExclusaoConta(): void {
    this.modalRef?.hide();
    this.spinner.show();
    this.acaoSalvar = 'putSituacao';

    this.contasService.delete(this.contaId).subscribe({
      next: (result: any) => {
        this.toastr.success(
          'Conta excluída com sucesso!',
          'Atualizado!'
        );
        this.spinner.hide();
        this.carregarContas();
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error(
          `Erro ao Excluir Conta`,
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


  public classDiasAtraso(valor: number): string {
    return valor > 0 ? 'valorMenorQueZero' : 'valorMaiorQueZero';
  }

  public classJuros(valor: number): string {
    return valor > 0 ? 'valorMenorQueZero' : '';
  }
}
