import { Fornecedor } from "./Fornecedor";
import { User } from "./User";

export class Conta {
  contaId: number;
  valor: number;
  dataVencimento: Date;
  dataPagamento?: Date;
  diasAtraso: number;
  anoMes?: number;
  tipoCusto: string;
  descricao: string;
  juros: number;
  userId: number;
  fornecedorId: number;
  nomeFornecedor: string;
  user: User;
  fornecedor: Fornecedor;
}
