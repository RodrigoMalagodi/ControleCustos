using System.Threading.Tasks;
using ControleCustos.Domain;
using ControleCustos.Persistence.Models;

namespace ControleCustos.Persistence.Contratos
{
    public interface IFornecedorPersist
    {
        Task<PageList<Fornecedor>> GetAllFornecedoresAsync(PageParams pageParams);
        Task<Fornecedor> GetFornecedorByIdAsync(int fornecedorId);
    }
}