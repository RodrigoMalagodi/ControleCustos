using System;
using System.Threading.Tasks;
using AutoMapper;
using ControleCustos.Application.Contratos;
using ControleCustos.Application.Dtos;
using ControleCustos.Domain;
using ControleCustos.Persistence.Contratos;
using ControleCustos.Persistence.Models;

namespace ControleCustos.Application.Contextos
{
    public class FornecedorService : IFornecedorService
    {
        private readonly IGeralPersist _geralPersist;

        private readonly IFornecedorPersist _fornecedorPersist;

        private readonly IMapper _mapper;

        public FornecedorService(
            IGeralPersist geralPersist,
            IFornecedorPersist fornecedorPersist,
            IMapper mapper
        )
        {
            _mapper = mapper;
            _fornecedorPersist = fornecedorPersist;
            _geralPersist = geralPersist;
        }

        public async Task<FornecedorDto>
        AddFornecedor(int userId, FornecedorDto model)
        {
            try
            {
                var fornecedor = _mapper.Map<Fornecedor>(model);
                fornecedor.UserId = userId;
                fornecedor.Ativo = true;
                _geralPersist.Add<Fornecedor> (fornecedor);
                if (await _geralPersist.SaveChangesAsync())
                {
                    var fornecedorRetorno =
                        await _fornecedorPersist
                            .GetFornecedorByIdAsync(fornecedor.FornecedorId);
                    return _mapper.Map<FornecedorDto>(fornecedorRetorno);
                }

                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<PageList<FornecedorDto>>
        GetAllFornecedoresAsync(PageParams pageParams)
        {
            try
            {
                var Fornecedors =
                    await _fornecedorPersist
                        .GetAllFornecedoresAsync(pageParams);
                if (Fornecedors == null)
                {
                    return null;
                }
                var resultado =
                    _mapper.Map<PageList<FornecedorDto>>(Fornecedors);

                resultado.CurrentPage = Fornecedors.CurrentPage;
                resultado.TotalPages = Fornecedors.TotalPages;
                resultado.PageSize = Fornecedors.PageSize;
                resultado.TotalCount = Fornecedors.TotalCount;

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<FornecedorDto>
        GetFornecedorByIdAsync(int fornecedorId)
        {
            try
            {
                var Fornecedor =
                    await _fornecedorPersist
                        .GetFornecedorByIdAsync(fornecedorId);
                if (Fornecedor == null)
                {
                    return null;
                }

                var resultado = _mapper.Map<FornecedorDto>(Fornecedor);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<FornecedorDto>
        UpdateFornecedor(int fornecedorId, FornecedorDto model)
        {
            try
            {
                var Fornecedor =
                    await _fornecedorPersist
                        .GetFornecedorByIdAsync(fornecedorId);
                if (Fornecedor == null)
                {
                    return null;
                }

                _mapper.Map (model, Fornecedor);
                model.FornecedorId = Fornecedor.FornecedorId;

                _geralPersist.Update<Fornecedor> (Fornecedor);

                if (await _geralPersist.SaveChangesAsync())
                {
                    var fornecedorRetorno =
                        await _fornecedorPersist
                            .GetFornecedorByIdAsync(Fornecedor.FornecedorId);
                    return _mapper.Map<FornecedorDto>(fornecedorRetorno);
                }

                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<FornecedorDto>
        UpdateSituacaoFornecedor(int fornecedorId, bool situacao)
        {
            try
            {
                var Fornecedor =
                    await _fornecedorPersist
                        .GetFornecedorByIdAsync(fornecedorId);
                if (Fornecedor == null)
                {
                    return null;
                }

                var model = new FornecedorDto();

                Fornecedor.Ativo = situacao;
                _mapper.Map(Fornecedor, model);

                _geralPersist.Update<Fornecedor> (Fornecedor);

                if (await _geralPersist.SaveChangesAsync())
                {
                    var fornecedorRetorno =
                        await _fornecedorPersist
                            .GetFornecedorByIdAsync(Fornecedor.FornecedorId);
                    return _mapper.Map<FornecedorDto>(fornecedorRetorno);
                }

                return null;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
