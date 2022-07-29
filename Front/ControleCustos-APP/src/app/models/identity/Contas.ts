import { Fornecedor } from "./Fornecedor";
import { User } from "./User";

export class Contas {
  contaId: number;
  valor: number;
  dataVencimento: Date;
  dataPagamento: Date;
  diasAtraso: number;
  anoMes: number;
  tipoCusto: string;
  descricao: string;
  juros: number;
  userId: number;
  fornecedorId: number;
  user: User;
  fornecedor: Fornecedor;
}



