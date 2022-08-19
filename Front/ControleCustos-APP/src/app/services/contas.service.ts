import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Conta } from '../models/identity/Conta';
import { Fornecedor } from '../models/identity/Fornecedor';
import { PaginatedResult } from '../models/Pagination';

@Injectable({
  providedIn: 'root',
})
export class ContasService {
  baseURL = environment.apiURL + '/api/Conta';

  constructor(private http: HttpClient) {}

  public situacaoFornecedor: boolean;

  public getContas(
    page?: number,
    itemsPerPage?: number,
    term?: string
  ): Observable<PaginatedResult<Conta[]>> {
    const paginatedResult: PaginatedResult<Conta[]> = new PaginatedResult<
      Conta[]
    >();

    let params = new HttpParams();

    if (page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    if (term != null && term != '') params = params.append('term', term);
    return this.http
      .get<Conta[]>(this.baseURL, { observe: 'response', params })
      .pipe(
        take(1),
        map((response) => {
          paginatedResult.result = response.body;
          if (response.headers.has('Pagination')) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          return paginatedResult;
        })
      );
  }

  public getContaById(id: number): Observable<Conta> {
    return this.http.get<Conta>(`${this.baseURL}/id/${id}`);
  }

  public getContaProximosDias(
    dataInicio: Date,
    dataFim: Date
  ): Observable<Conta[]> {
    return this.http.get<Conta[]>(
      `${this.baseURL}/periodo/${dataInicio}/${dataFim}`
    );
  }

  public getFornecedorAtivos(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(`${this.baseURL}`);
  }

  public post(conta: Conta): Observable<Conta> {
    return this.http.post<Conta>(this.baseURL, conta);
  }

  public delete(contaId: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/contaId/${contaId}`);
  }

  public put(conta: Conta): Observable<Conta> {
    return this.http.put<Conta>(`${this.baseURL}/id/${conta.contaId}`, conta);
  }
}
