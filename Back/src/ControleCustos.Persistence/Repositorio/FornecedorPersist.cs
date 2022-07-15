using System.Linq;
using System.Threading.Tasks;
using ControleCustos.Domain;
using ControleCustos.Persistence.Contexto;
using ControleCustos.Persistence.Contratos;
using ControleCustos.Persistence.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleCustos.Persistence.Repositorio
{
    public class FornecedorPersist : IFornecedorPersist
    {
        private readonly ControleCustosContext _context;

        public FornecedorPersist(ControleCustosContext context)
        {
            _context = context;
        }

        public Task<PageList<Fornecedor>> GetAllFornecedoresAsync(PageParams pageParams)
        {
            throw new System.NotImplementedException();
        }

        public async Task<PageList<Fornecedor>> GetAllFornecedorsAsync(PageParams pageParams)
        {
           IQueryable<Fornecedor> query = _context.Fornecedor;

            query = query
                .AsNoTracking()
                .Where(
                    e =>
                        (e.Nome.ToLower().Contains(pageParams.Term.ToLower()))|| 
                        (e.TipoFornecimento.ToLower().Contains(pageParams.Term.ToLower())) 
                )
                .OrderBy(e => e.FornecedorId);

            return await PageList<Fornecedor>.CreateAsync(
                query,
                pageParams.PageNumber,
                pageParams.pageSize
            );
        }

        public async Task<Fornecedor> GetFornecedorByIdAsync(int fornecedorId)
        {
            IQueryable<Fornecedor> query = _context.Fornecedor;

            query = query
                .AsNoTracking()
                .Where(e => e.FornecedorId == fornecedorId);

            return await query.FirstOrDefaultAsync();
        }
     
    }
}