using System.Threading.Tasks;
using ControleCustos.Application.Dtos;
using ControleCustos.Persistence.Models;

namespace ControleCustos.Application.Contratos
{
    public interface IContaService
    {
        Task<ContaDto> AddConta(ContaDto model);
        Task<ContaDto> UpdateConta(int contaId, ContaDto model);
        Task<bool> DeleteConta(int contaId);

        Task<PageList<ContaDto>> GetAllContasAsync(PageParams pageParams);
        Task<ContaDto> GetContaById(int contaId);
    }
}