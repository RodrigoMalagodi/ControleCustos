using System;
using System.Threading.Tasks;
using ControleCustos.Domain;
using ControleCustos.Persistence.Models;

namespace ControleCustos.Persistence.Contratos
{
    public interface IFornecedorPersist
    {
        Task<PageList<Fornecedor>> GetAllFornecedoresAsync(PageParams pageParams = null);
        Task<Fornecedor[]> GetAllFornecedoresAtivosAsync();
        Task<Fornecedor> GetFornecedorByIdAsync(int fornecedorId);
    }
}