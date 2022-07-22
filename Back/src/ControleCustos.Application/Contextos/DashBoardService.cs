using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ControleCustos.Application.Contratos;
using ControleCustos.Application.Dtos;
using ControleCustos.Persistence.Contratos;

namespace ControleCustos.Application.Contextos
{
    public class DashBoardService : IDashBoardService
    {
        private readonly IDashboardPersist _dashboardPersist;
        private readonly IMapper _mapper;
        public DashBoardService(
        IDashboardPersist dashboardPersist,
        IMapper mapper)
        {
            _mapper = mapper;
            _dashboardPersist = dashboardPersist;

        }

        public async Task<ContaDto[]> GetDadosDashBoardAsync(DateTime dataInicio, DateTime dataFim)
        {
            try
            {
                var Conta = await _dashboardPersist.GetDadosDashBoardAsync(dataInicio, dataFim);
                if (Conta == null)
                {
                    return null;
                }

                var resultado = _mapper.Map<ContaDto[]>(Conta);

                List<int> ListaAnoMes = new List<int>();
                var ListaValor = new List<ContaDto>();
                decimal valorTotal = 0;

                foreach (var item in resultado.Select(x => new { x.AnoMes }).GroupBy(x => x.AnoMes))
                {
                    ListaAnoMes.Add(item.Key);
                }

                foreach (int anoMes in ListaAnoMes)
                {
                    ContaDto dados = new ContaDto();
                    foreach (var b in resultado.Where(x => x.AnoMes == anoMes).Select(x => new { Valor = x.Valor }))
                    {
                        valorTotal += b.Valor;
                    }

                    dados.AnoMes = anoMes;
                    dados.Valor = valorTotal;
                    ListaValor.Add(dados);
                    valorTotal = 0;
                }

                var query = ListaValor.OrderBy(x => x.AnoMes).AsQueryable<ContaDto>();

                return query.ToArray();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ContaDto[]> GetDadosDashBoardFornecedorByIdAsync(int fornecedorID, DateTime dataInicio, DateTime dataFim)
        {
            try
            {
                var Conta = await _dashboardPersist.GetDadosDashBoardFornecedorByIdAsync(fornecedorID, dataInicio, dataFim);
                if (Conta == null)
                {
                    return null;
                }

                var resultado = _mapper.Map<ContaDto[]>(Conta);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ContaDto[]> GetDadosDashBoardTipoFornecimentoAsync(int tipoCusto, DateTime dataInicio, DateTime dataFim)
        {
           try
            {
                var Conta = await _dashboardPersist.GetDadosDashBoardTipoFornecimentoAsync(tipoCusto, dataInicio, dataFim);
                if (Conta == null)
                {
                    return null;
                }

                var resultado = _mapper.Map<ContaDto[]>(Conta);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}