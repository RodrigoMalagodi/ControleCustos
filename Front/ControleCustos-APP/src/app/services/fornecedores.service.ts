import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Fornecedor } from '../models/identity/Fornecedor';
import { PaginatedResult } from '../models/Pagination';

@Injectable({
  providedIn: 'root',
})
export class FornecedoresService {
  baseURL = environment.apiURL + '/api/Fornecedor';

  constructor(private http: HttpClient) {}

  public situacaoFornecedor : boolean;

  public getFornecedors(
    page?: number,
    itemsPerPage?: number,
    term?: string
  ): Observable<PaginatedResult<Fornecedor[]>> {
    const paginatedResult: PaginatedResult<Fornecedor[]> = new PaginatedResult<Fornecedor[]>();

    let params = new HttpParams();

    if (page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    if (term != null && term != '') params = params.append('term', term);
    return this.http
      .get<Fornecedor[]>(this.baseURL, { observe: 'response', params })
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

  public getFornecedorById(id: number): Observable<Fornecedor> {
    return this.http.get<Fornecedor>(`${this.baseURL}/id/${id}`);
  }

  public post(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.post<Fornecedor>(this.baseURL, fornecedor);
  }

  public put(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.put<Fornecedor>(
      `${this.baseURL}/id/${fornecedor.fornecedorId}`,
      fornecedor
    );
  }

  public putSituacao(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.put<Fornecedor>(
      `${this.baseURL}/id/${fornecedor.fornecedorId}/situacao/${this.situacaoFornecedor}`,
      fornecedor
    );
  }


}
