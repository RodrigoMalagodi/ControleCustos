using System.Threading.Tasks;
using ControleCustos.Application.Dtos;
using ControleCustos.Persistence.Models;

namespace ControleCustos.Application.Contratos
{
    public interface IFornecedorService
    {
        Task<FornecedorDto> AddFornecedor(FornecedorDto model);
        Task<FornecedorDto> UpdateFornecedor(int fornecedorId, FornecedorDto model);
        Task<bool> DeleteFornecedor(int fornecedorId);

        Task<PageList<FornecedorDto>> GetAllFornecedorsAsync(PageParams pageParams);
        Task<FornecedorDto> GetFornecedorById(int fornecedorId);
        
    }
}