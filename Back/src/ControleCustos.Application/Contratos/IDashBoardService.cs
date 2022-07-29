using System;
using System.Threading.Tasks;
using ControleCustos.Application.Dtos;

namespace ControleCustos.Application.Contratos
{
    public interface IDashBoardService
    {
        Task<ContaDto[]> GetDadosDashBoardAsync(DateTime dataInicio, DateTime dataFim);
        Task<ContaDto[]> GetDadosDashBoardFornecedorByIdAsync(int fornecedorId, DateTime dataInicio, DateTime dataFim);
        Task<ContaDto[]> GetDadosDashBoardTipoFornecimentoAsync(string tipoCusto, DateTime dataInicio, DateTime dataFim);
    }
}