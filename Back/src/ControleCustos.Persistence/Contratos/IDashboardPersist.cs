using System;
using System.Threading.Tasks;
using ControleCustos.Domain;
using ProEventos.Domain.Enum;

namespace ControleCustos.Persistence.Contratos
{
    public interface IDashboardPersist
    {
        Task<Conta[]> GetDadosDashBoardAsync(DateTime dataInicio, DateTime dataFim);
        Task<Conta[]> GetDadosDashBoardFornecedorByIdAsync(int fornecedorId, DateTime dataInicio, DateTime dataFim);
        Task<Conta[]> GetDadosDashBoardTipoFornecimentoAsync(int tipoCusto, DateTime dataInicio, DateTime dataFim);
    }
}