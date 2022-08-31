using System;
using System.Threading.Tasks;
using ControleCustos.Application.Dtos;

namespace ControleCustos.Application.Contratos
{
    public interface IDashBoardService
    {
        Task<ContaDto[]> GetDadosDashBoardPeriodoAsync(DateTime dataInicio, DateTime dataFim);
        Task<ContaDto[]> GetDadosDashBoardFornecedorAsync(DateTime dataInicio, DateTime dataFim);
        Task<ContaDto[]> GetDadosDashBoardTipoCustoAsync(DateTime dataInicio, DateTime dataFim);
        Task<ContaDto[]> GetDadosDashBoardTipoFornecimentoAsync(DateTime dataInicio, DateTime dataFim);
    }
}