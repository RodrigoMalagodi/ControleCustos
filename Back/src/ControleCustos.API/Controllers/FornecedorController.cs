using System;
using System.Threading.Tasks;
using ControleCustos.API.Extensions;
using ControleCustos.Application.Contratos;
using ControleCustos.Application.Dtos;
using ControleCustos.Persistence.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ControleCustos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FornecedorController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly ITokenService _tokenService;
        private readonly IFornecedorService _fornecedorService;
        private readonly IContaService _contaService;
        public FornecedorController(IAccountService accountService, ITokenService tokenService, IFornecedorService fornecedorService, IContaService contaService)
        {
            _contaService = contaService;
            _fornecedorService = fornecedorService;
            _accountService = accountService;
            _tokenService = tokenService;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] PageParams pageParams)
        {
            try
            {
                int userIdToken = User.GetUserId();
                if (userIdToken >= 1)
                {
                    var Fornecedor = await _fornecedorService.GetAllFornecedoresAsync(pageParams);
                    if (Fornecedor == null)
                    {
                        return NoContent();
                    }

                    Response.AddPagination(Fornecedor.CurrentPage, Fornecedor.PageSize, Fornecedor.TotalCount, Fornecedor.TotalPages);

                    return Ok(Fornecedor);
                }
                return BadRequest("Erro ao tentar recuperar Fornecedor.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar Fornecedor. Erro: {ex.Message}"
                );
            }
        }

        [HttpGet("id/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                int userIdToken = User.GetUserId();
                if (userIdToken >= 1)
                {
                    var Fornecedor = await _fornecedorService.GetFornecedorByIdAsync(id);
                    if (Fornecedor == null)
                    {
                        return NoContent();
                    }
                    return Ok(Fornecedor);
                }
                return BadRequest("Erro ao tentar recuperar Fornecedor.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar Fornecedor. Erro: {ex.Message}"
                );
            }
        }

        [HttpGet("fornecedorId/{fornecedorId}")]
        public async Task<IActionResult> GetByFornecedorId(int fornecedorId, [FromQuery] PageParams pageParams)
        {
            try
            {
                int userIdToken = User.GetUserId();
                if (userIdToken >= 1)
                {
                    var Contas = await _contaService.GetContaByFornecedorIdAsync(fornecedorId, pageParams);
                    if (Contas == null)
                    {
                        return NoContent();
                    }

                    Response.AddPagination(Contas.CurrentPage, Contas.PageSize, Contas.TotalCount, Contas.TotalPages);

                    return Ok(Contas);
                }
                return BadRequest("Erro ao tentar recuperar Fornecedor.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar Fornecedor. Erro: {ex.Message}"
                );
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(FornecedorDto model)
        {
            try
            {
                int userIdToken = User.GetUserId();
                if (userIdToken >= 1)
                {
                    model.UserId = userIdToken;
                    var Fornecedor = await _fornecedorService.AddFornecedor(userIdToken, model);
                    if (Fornecedor == null)
                    {
                        return BadRequest("Erro ao tentar adicionar Fornecedor.");
                    }
                    return Ok(Fornecedor);
                }
                return BadRequest("Erro ao tentar adicionar Fornecedor.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar adicionar Fornecedor. Erro: {ex.Message}"
                );
            }
        }

        [HttpPut("id/{id}")]
        public async Task<IActionResult> Put(int id, FornecedorDto model)
        {
            try
            {
                int userIdToken = User.GetUserId();
                if (userIdToken >= 1)
                {
                    model.UserId = userIdToken;
                    model.Ativo = true;
                    var Fornecedor = await _fornecedorService.UpdateFornecedor(id, model);
                    if (Fornecedor == null)
                    {
                        return BadRequest("Erro ao tentar atualizar Fornecedor.");
                    }
                    return Ok(Fornecedor);
                }
                return BadRequest("Erro ao tentar atualizar Fornecedor.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar atualizar Fornecedor. Erro: {ex.Message}"
                );
            }
        }

        [HttpPut("id/{id}/situacao/{situacao}")]
        public async Task<IActionResult> Put(int id, bool situacao)
        {
            try
            {
                int userIdToken = User.GetUserId();
                if (userIdToken >= 1)
                {
                    var Fornecedor = await _fornecedorService.UpdateSituacaoFornecedor(id, situacao);
                    if (Fornecedor == null)
                    {
                        return BadRequest("Erro ao tentar atualizar Fornecedor.");
                    }
                    return Ok(Fornecedor);
                }
                return BadRequest("Erro ao tentar atualizar Fornecedor.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar atualizar Fornecedor. Erro: {ex.Message}"
                );
            }
        }
    }
}