using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ControleCustos.Application.Contratos;
using ControleCustos.Application.Dtos;
using ControleCustos.Domain;
using ControleCustos.Persistence.Contratos;
using ControleCustos.Persistence.Models;

namespace ControleCustos.Application.Contextos
{
    public class ContaService : IContaService
    {
        private readonly IGeralPersist _geralPersist;

        private readonly IContaPersist _contaPersist;

        private readonly IMapper _mapper;

        public ContaService(
            IGeralPersist geralPersist,
            IContaPersist contaPersist,
            IMapper mapper
        )
        {
            _mapper = mapper;
            _contaPersist = contaPersist;
            _geralPersist = geralPersist;
        }

        public async Task<ContaDto> AddConta(int userId, ContaDto model)
        {
            try
            {
                var conta = _mapper.Map<Conta>(model);
                conta.UserId = userId;
                _geralPersist.Add<Conta>(conta);

                if (await _geralPersist.SaveChangesAsync())
                {
                    var ContaRetorno = await _contaPersist.GetContaByIdAsync(conta.ContaId);
                    return _mapper.Map<ContaDto>(ContaRetorno);
                }

                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteConta(int contaId)
        {
            try
            {
                var Conta = await _contaPersist.GetContaByIdAsync(contaId);
                if (Conta == null)
                {
                    throw new Exception("Conta para delete não foi encontrada.");
                }

                _geralPersist.Delete<Conta>(Conta);

                return await _geralPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<PageList<ContaDto>> GetAllContasAsync(PageParams pageParams)
        {
            try
            {
                var Contas = await _contaPersist.GetAllContasAsync(pageParams);
                if (Contas == null)
                {
                    return null;
                }

                var resultado = _mapper.Map<PageList<ContaDto>>(Contas);

                resultado.CurrentPage = Contas.CurrentPage;
                resultado.TotalPages = Contas.TotalPages;
                resultado.PageSize = Contas.PageSize;
                resultado.TotalCount = Contas.TotalCount;

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ContaDto> GetContaByIdAsync(int contaId)
        {
            try
            {
                var Conta = await _contaPersist.GetContaByIdAsync(contaId);
                if (Conta == null)
                {
                    return null;
                }

                var resultado = _mapper.Map<ContaDto>(Conta);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ContaDto> UpdateConta(int contaId, ContaDto model)
        {
            try
            {
                var conta = await _contaPersist.GetContaByIdAsync(contaId);
                if (conta == null)
                {
                    return null;
                }

                _mapper.Map(model, conta);

                _geralPersist.Update<Conta>(conta);

                if (await _geralPersist.SaveChangesAsync())
                {
                    var ContaRetorno =
                        await _contaPersist.GetContaByIdAsync(conta.ContaId);
                    return _mapper.Map<ContaDto>(ContaRetorno);
                }

                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<PageList<ContaDto>>GetContaByFornecedorIdAsync(int fornecedorId, PageParams pageParams)
        {
            try
            {
                var Contas =
                    await _contaPersist
                        .GetContaByFornecedorIdAsync(fornecedorId, pageParams);
                if (Contas == null)
                {
                    return null;
                }

                var resultado = _mapper.Map<PageList<ContaDto>>(Contas);

                resultado.CurrentPage = Contas.CurrentPage;
                resultado.TotalPages = Contas.TotalPages;
                resultado.PageSize = Contas.PageSize;
                resultado.TotalCount = Contas.TotalCount;

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ContaDto[]> GetContasSemanaCorrente(DateTime dataInicio, DateTime dataFim)
        {
            try
            {
                var Conta = await _contaPersist.GetContasSemanaCorrente(dataInicio, dataFim);
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
