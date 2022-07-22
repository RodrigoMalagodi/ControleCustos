using System.Collections.Generic;
using ControleCustos.Domain.Identity;
using ProEventos.Domain.Enum;

namespace ControleCustos.Domain
{
    public class Fornecedor
    {
        public int FornecedorId { get; set; }
        public string Nome { get; set; }
        public int TipoFornecimento { get; set; }
        public int UserId { get; set; }

        public User User { get; set; }
        public IEnumerable<Conta> Contas { get; set; }
    }
}