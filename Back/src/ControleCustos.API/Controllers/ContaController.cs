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

        private readonly IFornecedorService _fornecedorService;

        public ContaController(
            IAccountService accountService,
            ITokenService tokenService,
            IContaService contaService,
            IFornecedorService fornecedorService
        )
        {
            _fornecedorService = fornecedorService;
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
                    var Contas =
                        await _contaService.GetAllContasAsync(pageParams);
                    if (Contas == null)
                    {
                        return NoContent();
                    }

                    foreach (var conta in Contas)
                    {
                        var fornecedor =
                            await _fornecedorService
                                .GetFornecedorByIdAsync(conta.FornecedorId);
                        conta.NomeFornecedor = fornecedor.Nome;
                    }

                    Response
                        .AddPagination(Contas.CurrentPage,
                        Contas.PageSize,
                        Contas.TotalCount,
                        Contas.TotalPages);

                    return Ok(Contas);
                }
                return BadRequest("Erro ao tentar recuperar Contas.");
            }
            catch (Exception ex)
            {
                return this
                    .StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar Contas. Erro: {ex.Message}");
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
                return this
                    .StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar Contas. Erro: {ex.Message}");
            }
        }

        [HttpGet("periodo/{dataInicio}/{dataFim}")]
        public async Task<IActionResult>
        GetContasSemanaCorrente(DateTime dataInicio, DateTime dataFim)
        {
            try
            {
                int userIdToken = User.GetUserId();
                if (userIdToken >= 1)
                {
                    var Contas =
                        await _contaService
                            .GetContasSemanaCorrente(dataInicio, dataFim);
                    if (Contas == null)
                    {
                        return NoContent();
                    }

                    foreach (var conta in Contas)
                    {
                        var fornecedor =
                            await _fornecedorService
                                .GetFornecedorByIdAsync(conta.FornecedorId);
                        conta.NomeFornecedor = fornecedor.Nome;
                    }
                    return Ok(Contas);
                }
                return BadRequest("Erro ao tentar recuperar Contas.");
            }
            catch (Exception ex)
            {
                return this
                    .StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar Contas. Erro: {ex.Message}");
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
                    string anoMes =
                        (
                            model.DataVencimento.Year.ToString("0000") +
                            model.DataVencimento.Month.ToString("00")
                        );
                        
                    model.AnoMes = int.Parse(anoMes);
                    model.DataPagamento = new DateTime();
                    model.DiasAtraso = 0;
                    var Contas =
                        await _contaService.AddConta(userIdToken, model);
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
                return this
                    .StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar adicionar Contas. Erro: {ex.Message}");
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
                    DateTime vencimento = (DateTime)model.DataVencimento;
                    DateTime pagamento = (DateTime)model.DataPagamento;
                    int diasAtraso = (int)Math.Floor(pagamento.Subtract(vencimento).TotalDays);
                    model.DiasAtraso = diasAtraso;
                    model.UserId = userIdToken;

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
                return this
                    .StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar atualizar Contas. Erro: {ex.Message}");
            }
        }

        [HttpDelete("contaId/{contaId}")]
        public async Task<IActionResult> Delete(int contaId)
        {
            try
            {
                int userIdToken = User.GetUserId();
                if (userIdToken >= 1)
                {
                    var evento = await _contaService.GetContaByIdAsync(contaId);
                    if (evento == null)
                    {
                        return NoContent();
                    }

                    if (await _contaService.DeleteConta(contaId))
                    {
                        return Ok(new { message = "Deletado" });
                    }
                    return BadRequest("Erro ao tentar excluir evento.");
                }
                return BadRequest("Erro ao tentar excluir evento.");
            }
            catch (Exception ex)
            {
                return this
                    .StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
            }
        }
    }
}
