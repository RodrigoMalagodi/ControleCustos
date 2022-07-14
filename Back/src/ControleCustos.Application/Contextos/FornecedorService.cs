using System.Threading.Tasks;
using ControleCustos.Application.Contratos;
using ControleCustos.Application.Dtos;
using ControleCustos.Persistence.Models;

namespace ControleCustos.Application.Contextos
{
    public class FornecedorService : IFornecedorService
    {
        public Task<FornecedorDto> AddFornecedor(FornecedorDto model)
        {
            throw new System.NotImplementedException();
        }

        public Task<bool> DeleteFornecedor(int fornecedorId)
        {
            throw new System.NotImplementedException();
        }

        public Task<PageList<FornecedorDto>> GetAllFornecedorsAsync(PageParams pageParams)
        {
            throw new System.NotImplementedException();
        }

        public Task<FornecedorDto> GetFornecedorById(int fornecedorId)
        {
            throw new System.NotImplementedException();
        }

        public Task<FornecedorDto> UpdateFornecedor(int fornecedorId, FornecedorDto model)
        {
            throw new System.NotImplementedException();
        }
    }
}