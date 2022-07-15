using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ControleCustos.Application.Dtos
{
    public class ContaDto
    {
        public int ContaId { get; set; }
        public decimal Valor { get; set; }
        public string DataPagamento { get; set; }
        public int AnoMes { get; set; }
        public string TipoCusto { get; set; }
        public string Descricao { get; set; }
        public decimal Juros { get; set; }
        public int UserId { get; set; }
        public UserDto UserDto { get; set; }
        public FornecedorDto FornecedorDto { get; set; }
    }
}
