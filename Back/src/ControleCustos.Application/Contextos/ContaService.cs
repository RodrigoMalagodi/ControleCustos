using System.Threading.Tasks;
using ControleCustos.Application.Contratos;
using ControleCustos.Application.Dtos;
using ControleCustos.Persistence.Models;

namespace ControleCustos.Application.Contextos
{
    public class ContaService : IContaService
    {
        public Task<ContaDto> AddConta(ContaDto model)
        {
            throw new System.NotImplementedException();
        }

        public Task<bool> DeleteConta(int contaId)
        {
            throw new System.NotImplementedException();
        }

        public Task<PageList<ContaDto>> GetAllContasAsync(PageParams pageParams)
        {
            throw new System.NotImplementedException();
        }

        public Task<ContaDto> GetContaById(int contaId)
        {
            throw new System.NotImplementedException();
        }

        public Task<ContaDto> UpdateConta(int contaId, ContaDto model)
        {
            throw new System.NotImplementedException();
        }
    }
}