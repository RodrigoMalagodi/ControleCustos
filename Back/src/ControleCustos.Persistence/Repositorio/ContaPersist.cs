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

        public async Task<PageList<Conta>> GetAllContasAsync(PageParams pageParams)
        {
           IQueryable<Conta> query = _context.Conta
                                            .AsNoTracking()
                                            .Where(
                                                e =>
                                                    (e.Descricao.ToLower().Contains(pageParams.Term.ToLower()))
                                            )
                                            .OrderBy(e => e.ContaId);

            return await PageList<Conta>.CreateAsync(
                query,
                pageParams.PageNumber,
                pageParams.pageSize
            );
        }

        public async Task<Conta> GetContaByIdAsync(int contaId)
        {
            IQueryable<Conta> query = _context.Conta
                                            .AsNoTracking()
                                            .Where(e => e.ContaId == contaId);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Conta> GetDadosDashBoardAsync(DateTime dataInicio, DateTime dataFim)
        {
            IQueryable<Conta> resultado = _context.Conta
                                                .AsNoTracking()
                                                .Where 
                                                (x => 
                                                    x.DataPagamento >= dataInicio && 
                                                    x.DataPagamento <= dataFim);

            List<int> ListaAnoMes = new List<int>();
            List<Conta> ListaValor = new List<Conta>();
            decimal valorTotal = 0;

            foreach (var item in resultado.Select(x => new { x.AnoMes }))
            {
                ListaAnoMes.Add(item.AnoMes);
            }

            foreach (var a in ListaAnoMes)
            {
                Conta dados = new Conta();
                foreach (var b in resultado.Where(x=> x.AnoMes == a).Select(x => new {Valor = x.Valor }))
                {
                    valorTotal += b.Valor;
                }   

                dados.AnoMes = (int)a;
                dados.Valor = valorTotal;
                ListaValor.Add(dados);
            }
            
            var query = ListaValor.OrderBy(x=>x.AnoMes) as IQueryable<Conta>;
            
            return await query.FirstOrDefaultAsync();
        }
    }
}