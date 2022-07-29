using System.Collections.Generic;

namespace ControleCustos.Application.Dtos
{
    public class FornecedorDto
    {
        public int FornecedorId { get; set; }
        public string Nome { get; set; }
        public string TipoFornecimento { get; set; }
        public int UserId { get; set; }
        public bool Ativo { get; set; }

        public UserDto UserDto { get; set; }
        public IEnumerable<ContaDto> Contas {get; set;}
    }
}