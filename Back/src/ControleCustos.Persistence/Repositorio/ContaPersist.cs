using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ControleCustos.Domain;
using ControleCustos.Persistence.Contexto;
using ControleCustos.Persistence.Contratos;
using ControleCustos.Persistence.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleCustos.Persistence.Repositorio
{
    public class ContaPersist : IContaPersist
    {
        private readonly ControleCustosContext _context;

        public ContaPersist(ControleCustosContext context)
        {
            _context = context;
        }

        public async Task<PageList<Conta>>
        GetAllContasAsync(PageParams pageParams)
        {
            IQueryable<Conta> query =
                _context
                    .Conta
                    .AsNoTracking()
                    .Where(e =>
                        (
                        e
                            .Descricao
                            .ToLower()
                            .Contains(pageParams.Term.ToLower())
                        ))
                    .Include(e => e.Fornecedor)
                    .OrderBy(e => e.ContaId);

            return await PageList<Conta>
                .CreateAsync(query, pageParams.PageNumber, pageParams.pageSize);
        }

        public async Task<Conta> GetContaByIdAsync(int contaId)
        {
            IQueryable<Conta> query =
                                _context.Conta
                                .AsNoTracking()
                                .Where(e => e.ContaId == contaId)
                                .Include(e =>e.Fornecedor);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<PageList<Conta>>
        GetContaByFornecedorIdAsync(int fornecedorId, PageParams pageParams)
        {
            IQueryable<Conta> query =
                _context
                    .Conta
                    .AsNoTracking()
                    .Where(e => e.FornecedorId == fornecedorId);

            return await PageList<Conta>
                .CreateAsync(query, pageParams.PageNumber, pageParams.pageSize);
        }

        public async Task<Conta[]>
        GetContasSemanaCorrente(DateTime dataInicio, DateTime dataFim)
        {
            IQueryable<Conta> query =
                _context
                    .Conta
                    .AsNoTracking()
                    .Where(e => e.DataVencimento >= dataInicio && e.DataVencimento <= dataFim);

           return await query.ToArrayAsync();
        }
    }
}
