using System;


namespace ControleCustos.Application.Dtos
{
    public class ContaDto
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
        public string NomeFornecedor { get; set; }
        
        public UserDto UserDto { get; set; }
        public FornecedorDto FornecedorDto { get; set; }
        
    }
}
