using System;
using ControleCustos.Domain.Identity;

namespace ControleCustos.Domain
{
    public class Conta
    {
        public int ContaId { get; set; }
        public decimal Valor { get; set; }
        public DateTime DataVencimento { get; set; }
        public DateTime? DataPagamento { get; set; }
        public int DiasAtraso { get; set; }
        public int AnoMes { get; set; }
        public string TipoCusto { get; set; }
        public string Descricao { get; set; }
        public decimal Juros { get; set; }
        public int UserId { get; set; }
        public int FornecedorId { get; set; }
        public User User { get; set; }
        public Fornecedor Fornecedor { get; set; }
    }
}