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
    public class ContaController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly ITokenService _tokenService;
        private readonly IContaService _contaService;
        public ContaController(IAccountService accountService, ITokenService tokenService, IContaService contaService)
        {
            _contaService = contaService;
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
                    var Contas = await _contaService.GetAllContasAsync(pageParams);
                    if (Contas == null)
                    {
                        return NoContent();
                    }

                    Response.AddPagination(Contas.CurrentPage, Contas.PageSize, Contas.TotalCount, Contas.TotalPages);

                    return Ok(Contas);
                }
                return BadRequest("Erro ao tentar recuperar Contas.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar Contas. Erro: {ex.Message}"
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
                    var Contas = await _contaService.GetContaByIdAsync(id);
                    if (Contas == null)
                    {
                        return NoContent();
                    }
                    return Ok(Contas);
                }
                return BadRequest("Erro ao tentar recuperar Contas.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar Contas. Erro: {ex.Message}"
                );
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(ContaDto model)
        {
            try
            {
                int userIdToken = User.GetUserId();
                if (userIdToken >= 1)
                {
                    string anoMes = (model.DataVencimento.Year.ToString("0000") + model.DataVencimento.Month.ToString("00"));
                    model.AnoMes = int.Parse(anoMes);

                    DateTime vencimento = model.DataVencimento;
                    DateTime pagamento = model.DataPagamento;
                    int diasAtraso = (int)pagamento.Subtract(vencimento).TotalDays;
                    model.DiasAtraso = diasAtraso;

                    var Contas = await _contaService.AddConta(userIdToken, model);
                    if (Contas == null)
                    {
                        return BadRequest("Erro ao tentar adicionar Conta.");
                    }
                    return Ok(Contas);
                }
                return BadRequest("Erro ao tentar adicionar Conta.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar adicionar Contas. Erro: {ex.Message}"
                );
            }
        }

        [HttpPut("id/{id}")]
        public async Task<IActionResult> Put(int id, ContaDto model)
        {
            try
            {
                int userIdToken = User.GetUserId();
                if (userIdToken >= 1)
                {
                    var Contas = await _contaService.UpdateConta(id, model);
                    if (Contas == null)
                    {
                        return BadRequest("Erro ao tentar atualizar Conta.");
                    }
                    return Ok(Contas);
                }
                return BadRequest("Erro ao tentar atualizar Conta.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar atualizar Contas. Erro: {ex.Message}"
                );
            }
        }
    }
}