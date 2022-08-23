using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ControleCustos.Domain;

namespace ControleCustos.Persistence.Contratos
{
    public interface IDashboardPersist
    {
        Task<Conta[]> GetDadosDashBoardPeriodoAsync(DateTime dataInicio, DateTime dataFim);
        Task<Conta[]> GetDadosDashBoardFornecedorByIdAsync(int fornecedorId, DateTime dataInicio, DateTime dataFim);
        Task<List<Conta>> GetDadosDashBoardTipoFornecimentoAsync(string tipoCusto, DateTime dataInicio, DateTime dataFim);
        Task<List<Conta>> GetDadosDashBoardByFornececedorAsync(DateTime dataInicio, DateTime dataFim);
    }
}