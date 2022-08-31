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

  public getDadosDashBoardPeriodo(dataInicio: Date, dataFim: Date): Observable<Conta[]> {
    return this.http.get<Conta[]>(`${this.baseURL}/periodo/${dataInicio}/${dataFim}`);
  }

  public getDadosDashBoardFornecedorId(fornecedorId: number, dataInicio: Date, dataFim: Date): Observable<Conta[]> {
    return this.http.get<Conta[]>(`${this.baseURL}/fornecedorId/${fornecedorId}/${dataInicio}/${dataFim}`);
  }

  public getDadosDashBoardTipoCusto(tipoCusto:string, dataInicio: Date, dataFim: Date): Observable<Conta[]> {
    return this.http.get<Conta[]>(`${this.baseURL}/tipoCusto/${tipoCusto}/${dataInicio}/${dataFim}`);
  }

  public getDadosDashBoardTipoFornecimento(tipoFornecimento:string, dataInicio: Date, dataFim: Date): Observable<Conta[]> {
    return this.http.get<Conta[]>(`${this.baseURL}/tipoFornecimento/${tipoFornecimento}/${dataInicio}/${dataFim}`);
  }

  public getDadosDashBoardFornecedor(dataInicio: Date, dataFim: Date): Observable<Conta[]> {
    return this.http.get<Conta[]>(`${this.baseURL}/fornecedor/${dataInicio}/${dataFim}`);
  }

}
