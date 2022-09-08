import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Conta } from '../models/identity/Conta';

@Injectable({
  providedIn: 'root'
})
export class DashboardsService {

  baseURL = environment.apiURL + '/api/Dashboard';

  constructor(private http: HttpClient) {}

  public getDadosDashBoardPeriodo(dataInicio: string, dataFim: string): Observable<Conta[]> {
    return this.http.get<Conta[]>(`${this.baseURL}/periodo/${dataInicio}/${dataFim}`);
  }

  public getDadosDashBoardTipoCusto(dataInicio: Date, dataFim: Date): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.baseURL}/tipoCusto/${dataInicio}/${dataFim}`);
  }

  public getDadosDashBoardTipoFornecimento(dataInicio: Date, dataFim: Date): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.baseURL}/tipoFornecimento/${dataInicio}/${dataFim}`);
  }

  public getDadosDashBoardFornecedor(dataInicio: Date, dataFim: Date): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.baseURL}/fornecedor/${dataInicio}/${dataFim}`);
  }

}
