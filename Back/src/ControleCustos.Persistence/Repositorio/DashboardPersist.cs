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

        public async Task<List<Conta>>  GetDadosDashBoardPeriodoAsync(DateTime dataInicio, DateTime dataFim)
        {
            IQueryable<Conta> query = _context.Conta
                                                .AsNoTracking()
                                                .Where
                                                (x =>
                                                    x.DataVencimento >= dataInicio &&
                                                    x.DataVencimento <= dataFim
                                                )
                                                .OrderBy(x => x.AnoMes);

            return await query.ToListAsync();
        }

        public async Task<List<Conta>> GetDadosDashBoardFornecedorAsync(DateTime dataInicio, DateTime dataFim)
        {
            var query = await 
                            (
                                from a in _context.Conta
                                join b in _context.Fornecedor on a.FornecedorId equals b.FornecedorId
                                where
                                a.DataVencimento >= dataInicio &&
                                a.DataVencimento <= dataFim
                                orderby a.AnoMes
                                select new { b.Nome, a.Valor, a.AnoMes }
                            )
                            .Distinct()
                            .ToListAsync();

            List<Conta> ListaValores = new List<Conta>();

            foreach (var item in query.OrderBy(x => x.Nome))
            {
                var conta = new Conta();
                conta.Descricao = item.Nome;
                conta.Valor = item.Valor;
                conta.AnoMes = item.AnoMes;
                ListaValores.Add(conta);
            }

            return ListaValores.OrderBy(x => x.AnoMes).ToList();
        }

        public async Task<List<Conta>> GetDadosDashBoardTipoCustoAsync(DateTime dataInicio, DateTime dataFim)
        {
            var query = await 
                            (
                                from a in _context.Conta
                                where 
                                a.DataVencimento >= dataInicio &&
                                a.DataVencimento <= dataFim
                                orderby a.AnoMes
                                select new { a.AnoMes, a.Valor, a.TipoCusto }
                            ).ToListAsync();

            List<Conta> ListaValores = new List<Conta>();

            foreach (var item in query.OrderBy(x => x.AnoMes))
            {
                var conta = new Conta();
                conta.AnoMes = item.AnoMes;
                conta.Valor = item.Valor;
                conta.TipoCusto = item.TipoCusto;
                ListaValores.Add(conta);
            }

           return ListaValores.OrderBy(x => x.AnoMes).ToList();
        }
 
        public async Task<List<Conta>> GetDadosDashBoardTipoFornecimentoAsync(DateTime dataInicio, DateTime dataFim)
        {
            var query = await       
                            (
                                from a in _context.Conta
                                join b in _context.Fornecedor on a.FornecedorId equals b.FornecedorId
                                where 
                                a.DataVencimento >= dataInicio &&
                                a.DataVencimento <= dataFim
                                orderby a.AnoMes
                                select new { a.AnoMes, a.Valor, b.TipoFornecimento }
                            ).ToListAsync();

            List<Conta> ListaValores = new List<Conta>();

            foreach (var item in query.OrderBy(x => x.AnoMes))
            {
                var conta = new Conta();
                conta.AnoMes = item.AnoMes;
                conta.Valor = item.Valor;
                conta.Descricao = item.TipoFornecimento;
                ListaValores.Add(conta);
            }

            return ListaValores.OrderBy(x => x.AnoMes).ToList();
        }

    }
}