using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ControleCustos.Domain;
using ControleCustos.Persistence.Models;

namespace ControleCustos.Persistence.Contratos
{
    public interface IContaPersist
    {
        Task<PageList<Conta>> GetAllContasAsync(PageParams pageParams);
        Task<Conta> GetContaByIdAsync(int contaId);
        Task<Conta> GetDadosDashBoardAsync(DateTime dataInicio, DateTime dataFim);
    }
}