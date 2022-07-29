using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ControleCustos.Domain;
using ControleCustos.Persistence.Contexto;
using ControleCustos.Persistence.Contratos;
using Microsoft.EntityFrameworkCore;

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

        public async Task<List<Conta>> GetDadosDashBoardTipoFornecimentoAsync(string tipoFornecimento, DateTime dataInicio, DateTime dataFim)
        {
            var query = await (
                                from a in _context.Conta
                                join b in _context.Fornecedor on a.FornecedorId equals b.FornecedorId
                                where b.TipoFornecimento == tipoFornecimento &&
                                a.DataPagamento >= dataInicio &&
                                a.DataPagamento <= dataFim
                                orderby a.AnoMes
                                select new { a.AnoMes, a.Valor }
                            ).ToListAsync();

            List<Conta> ListaValores = new List<Conta>();

            foreach (var item in query.OrderBy(x => x.AnoMes))
            {
                var conta = new Conta();
                conta.AnoMes = item.AnoMes;
                conta.Valor = item.Valor;
                ListaValores.Add(conta);
            }

            return ListaValores;
        }
    }
}