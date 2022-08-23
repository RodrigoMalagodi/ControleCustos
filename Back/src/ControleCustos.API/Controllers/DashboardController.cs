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
    public class DashboardController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly ITokenService _tokenService;
        private readonly IDashBoardService _dashboardService;
        public DashboardController(IAccountService accountService, ITokenService tokenService, IDashBoardService cdashboardervice)
        {
            _dashboardService = cdashboardervice;
            _accountService = accountService;
            _tokenService = tokenService;
        }

        [HttpGet("periodo/{dataInicio}/{dataFim}")]
        public async Task<IActionResult> GetDadosDashBoardPeriodoAsync(DateTime dataInicio, DateTime dataFim)
        {
            try
            {
                int userIdToken = User.GetUserId();
                if (userIdToken >= 1)
                {
                    var Contas = await _dashboardService.GetDadosDashBoardPeriodoAsync(dataInicio, dataFim);
                    if (Contas == null)
                    {
                        return NoContent();
                    }
                    return Ok(Contas);
                }
                return BadRequest("Erro ao tentar recuperar dados.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar dados. Erro: {ex.Message}"
                );
            }

        }

        [HttpGet("fornecedorId/{fornecedorId}/periodo/{dataInicio}/{dataFim}")]
        public async Task<IActionResult> GetDadosDashBoardFornecedorByIdAsync(int fornecedorId, DateTime dataInicio, DateTime dataFim)
        {
            try
            {
                int userIdToken = User.GetUserId();
                if (userIdToken >= 1)
                {
                    var Contas = await _dashboardService.GetDadosDashBoardFornecedorByIdAsync(fornecedorId, dataInicio, dataFim);
                    if (Contas == null)
                    {
                        return NoContent();
                    }
                    return Ok(Contas);
                }
                return BadRequest("Erro ao tentar recuperar dados.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar dados. Erro: {ex.Message}"
                );
            }

        }

        [HttpGet("tipoFornecimento/{tipoFornecimento}/periodo/{dataInicio}/{dataFim}")]
        public async Task<IActionResult> GetDadosDashBoardTipoFornecimentoAsync(string tipoFornecimento, DateTime dataInicio, DateTime dataFim)
        {
            try
            {
                int userIdToken = User.GetUserId();
                if (userIdToken >= 1)
                {
                    var Contas = await _dashboardService.GetDadosDashBoardTipoFornecimentoAsync(tipoFornecimento, dataInicio, dataFim);
                    if (Contas == null)
                    {
                        return NoContent();
                    }
                    return Ok(Contas);
                }
                return BadRequest("Erro ao tentar recuperar dados.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar dados. Erro: {ex.Message}"
                );
            }

        }

        [HttpGet("fornecedor/{dataInicio}/{dataFim}")]
        public async Task<IActionResult> GetDadosDashBoardByFornececedorAsync(DateTime dataInicio, DateTime dataFim)
        {
            try
            {
                int userIdToken = User.GetUserId();
                if (userIdToken >= 1)
                {
                    var Contas = await _dashboardService.GetDadosDashBoardByFornececedorAsync(dataInicio, dataFim);
                    if (Contas == null)
                    {
                        return NoContent();
                    }
                    return Ok(Contas);
                }
                return BadRequest("Erro ao tentar recuperar dados.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar dados. Erro: {ex.Message}"
                );
            }

        }

    }
}