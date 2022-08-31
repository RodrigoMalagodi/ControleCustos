using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ControleCustos.Domain;

namespace ControleCustos.Persistence.Contratos
{
    public interface IDashboardPersist
    {
        Task<List<Conta>> GetDadosDashBoardPeriodoAsync(DateTime dataInicio, DateTime dataFim);
        Task<List<Conta>> GetDadosDashBoardFornecedorAsync(DateTime dataInicio, DateTime dataFim);
        Task<List<Conta>> GetDadosDashBoardTipoCustoAsync(DateTime dataInicio, DateTime dataFim);
        Task<List<Conta>> GetDadosDashBoardTipoFornecimentoAsync(DateTime dataInicio, DateTime dataFim);
    }
}