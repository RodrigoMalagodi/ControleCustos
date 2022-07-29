using System.Threading.Tasks;
using ControleCustos.Application.Dtos;
using ControleCustos.Persistence.Models;

namespace ControleCustos.Application.Contratos
{
    public interface IFornecedorService
    {
        Task<FornecedorDto> AddFornecedor(int userId, FornecedorDto model);
        Task<FornecedorDto> UpdateFornecedor(int fornecedorId, FornecedorDto model);
        Task<FornecedorDto> UpdateSituacaoFornecedor(int fornecedorId, bool situacao);
        
        Task<PageList<FornecedorDto>> GetAllFornecedoresAsync(PageParams pageParams);
        Task<FornecedorDto> GetFornecedorByIdAsync(int fornecedorId);
        
    }
}