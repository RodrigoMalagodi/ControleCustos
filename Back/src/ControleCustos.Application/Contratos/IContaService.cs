using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ControleCustos.Application.Dtos;
using ControleCustos.Persistence.Models;

namespace ControleCustos.Application.Contratos
{
    public interface IContaService
    {
        Task<ContaDto> AddConta(int userId, ContaDto model);
        Task<ContaDto> UpdateConta(int contaId, ContaDto model);
        Task<bool> DeleteConta(int contaId);

        Task<PageList<ContaDto>> GetAllContasAsync(PageParams pageParams);
        Task<PageList<ContaDto>> GetContaByFornecedorIdAsync(int fornecedorId, PageParams pageParams);
        Task<ContaDto> GetContaByIdAsync(int contaId);
        Task<ContaDto[]> GetContasSemanaCorrenteAsync(DateTime dataInicio, DateTime dataFim);
    }
}