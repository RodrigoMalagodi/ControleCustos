import { Conta } from "./Conta"
import { User } from "./User"

export class Fornecedor {
   fornecedorId: number;
   nome: string;
   tipoFornecimento: string;
   userId: number;
   ativo?: boolean;

   user: User;
   contas: Conta[];
}
