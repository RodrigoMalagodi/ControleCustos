import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BuildArrayChart } from '../models/identity/BuildArrayChart';
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

  public getDadosDashBoardTipoCusto(dataInicio: string, dataFim: string): Observable<BuildArrayChart[]> {
    return this.http.get<BuildArrayChart[]>(`${this.baseURL}/tipoCusto/${dataInicio}/${dataFim}`);
  }

  public getDadosDashBoardTipoFornecimento(dataInicio: string, dataFim: string): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.baseURL}/tipoFornecimento/${dataInicio}/${dataFim}`);
  }

  public getDadosDashBoardFornecedor(dataInicio: string, dataFim: string): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.baseURL}/fornecedor/${dataInicio}/${dataFim}`);
  }

}
