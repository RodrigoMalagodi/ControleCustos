using System;
using System.Linq;
using System.Threading.Tasks;
using ControleCustos.Domain;
using ControleCustos.Persistence.Contexto;
using ControleCustos.Persistence.Contratos;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain.Enum;

namespace ControleCustos.Persistence.Repositorio
{
    public class DashboardPersist : IDashboardPersist
    {
        private readonly ControleCustosContext _context;

        public DashboardPersist(ControleCustosContext context)
        {
            _context = context;

        }

        public async Task<Conta[]> GetDadosDashBoardAsync(DateTime dataInicio, DateTime dataFim)
        {
            IQueryable<Conta> query = _context.Conta
                                                .AsNoTracking()
                                                .Where
                                                (x =>
                                                    x.DataPagamento >= dataInicio &&
                                                    x.DataPagamento <= dataFim
                                                )
                                                .OrderBy(x => x.AnoMes);

            return await query.ToArrayAsync();
        }

        public async Task<Conta[]> GetDadosDashBoardFornecedorByIdAsync(int fornecedorId, DateTime dataInicio, DateTime dataFim)
        {
            IQueryable<Conta> query = _context.Conta
                                                .AsNoTracking()
                                                .Where
                                                (x =>
                                                    x.FornecedorId == fornecedorId &&
                                                    (
                                                        x.DataPagamento >= dataInicio &&
                                                        x.DataPagamento <= dataFim
                                                    )
                                                )
                                                .OrderBy(x => x.AnoMes);

            return await query.ToArrayAsync();
        }

        public async Task<Conta[]> GetDadosDashBoardTipoFornecimentoAsync(int tipoFornecimento, DateTime dataInicio, DateTime dataFim)
        {
            var fornecedores = 
                            (
                                from a in _context.Fornecedor
                                where a.TipoFornecimento == tipoFornecimento
                                select new { a.FornecedorId }
                            ).ToList();

            IQueryable<Conta> query = _context.Conta
                                    .AsNoTracking()
                                    .Where
                                            (x =>
                                                x.FornecedorId.Equals(fornecedores) &&
                                                (
                                                    x.DataPagamento >= dataInicio &&
                                                    x.DataPagamento <= dataFim
                                                )
                                            ).OrderBy(x => x.AnoMes);

            return await query.ToArrayAsync();
        }
    }
}