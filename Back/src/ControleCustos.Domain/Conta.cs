using ControleCustos.Domain.Identity;

namespace ControleCustos.Domain
{
    public class Conta
    {
        public int ContaId { get; set; }
        public decimal Valor { get; set; }
        public string DataPagamento { get; set; }
        public string TipoCusto { get; set; }
        public decimal juros { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public Fornecedor Fornecedor { get; set; }
    }
}