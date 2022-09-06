using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ControleCustos.API.Extensions;
using ControleCustos.API.Models;
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
        public async Task<IActionResult> GetDadosDashBoardPeriodo(DateTime dataInicio, DateTime dataFim)
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

        [HttpGet("fornecedor/{dataInicio}/{dataFim}")]
        public async Task<IActionResult> GetDadosDashBoardFornecedor(DateTime dataInicio, DateTime dataFim)
        {
            List<int> ListaAnoMes = new List<int>();
            List<ContaDto> ListaValor = new List<ContaDto>();
            List<DataPoints> ListaResult = new List<DataPoints>();
            BuildArrayChart buildArrayChart = new BuildArrayChart();
            List<BuildArrayChart> retorno = new List<BuildArrayChart>();

            try
            {
                int userIdToken = User.GetUserId();
                if (userIdToken >= 1)
                {
                    var Contas = await _dashboardService.GetDadosDashBoardFornecedorAsync(dataInicio, dataFim);
                    if (Contas == null)
                    {
                        return NoContent();
                    }

                    foreach (var item in Contas.Select(x => new { x.AnoMes }).GroupBy(x => x.AnoMes))
                    {
                        ListaAnoMes.Add(item.Key);
                    }

                    foreach (var anoMes in ListaAnoMes)
                    {
                        foreach (var item in Contas
                                        .Select(x => new {NomeFornecedor = x.Descricao, AnoMes = x.AnoMes, Valor = x.Valor})
                                        .Where(x => x.AnoMes == anoMes)
                                        .GroupBy(x => x.AnoMes)
                                        .ToList())
                        {
                            ListaResult = new List<DataPoints>();
                            for (int i = 0; i < item.Count(); i++)
                            {
                                var dataPoint = new DataPoints();    
                                dataPoint.Description = item.ToArray()[i].NomeFornecedor;
                                dataPoint.Value = item.ToArray()[i].Valor;
                                ListaResult.Add(dataPoint);
                            }
                            
                            buildArrayChart = new BuildArrayChart(){ Target = anoMes.ToString(), dataPoints = ListaResult }; 
                            retorno.Add(buildArrayChart);
                        }

                        
                    }

                    return Ok(new { dados = retorno }); 
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

        [HttpGet("tipoCusto/{dataInicio}/{dataFim}")]
        public async Task<IActionResult> GetDadosDashBoardTipoCusto(DateTime dataInicio, DateTime dataFim)
        {
            List<string> ListaTipoCusto = new List<string>();
            List<ContaDto> ListaValor = new List<ContaDto>();
            List<DataPoints> ListaResult = new List<DataPoints>();
            BuildArrayChart buildArrayChart = new BuildArrayChart();
            List<BuildArrayChart> retorno = new List<BuildArrayChart>();
            try
            {
                int userIdToken = User.GetUserId();
                if (userIdToken >= 1)
                {
                    var Contas = await _dashboardService.GetDadosDashBoardTipoCustoAsync(dataInicio, dataFim);
                    if (Contas == null)
                    {
                        return NoContent();
                    }
                    
                    foreach (var item in Contas.Select(x => new { x.TipoCusto }).GroupBy(x => x.TipoCusto))
                    {
                        ListaTipoCusto.Add(item.Key);
                    }

                    foreach (var tipoCusto in ListaTipoCusto)
                    {
                        foreach (var conta in Contas
                                        .Select(x => new {TipoCusto = x.TipoCusto, AnoMes = x.AnoMes, Valor = x.Valor})
                                        .Where(x => x.TipoCusto == tipoCusto)
                                        .GroupBy(x => x.TipoCusto)
                                        .ToList())
                        {
                            ListaResult = new List<DataPoints>();
                            for (int i = 0; i < conta.Count(); i++)
                            {
                                var dataPoint = new DataPoints();    
                                dataPoint.Description = conta.ToArray()[i].AnoMes.ToString();
                                dataPoint.Value = conta.ToArray()[i].Valor;
                                ListaResult.Add(dataPoint);
                            }
                            
                            buildArrayChart = new BuildArrayChart(){ Target = tipoCusto, dataPoints = ListaResult }; 
                            retorno.Add(buildArrayChart);
                        }

                        
                    }

                    return Ok(new { dados = retorno }); 
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

        [HttpGet("tipoFornecimento/{dataInicio}/{dataFim}")]
        public async Task<IActionResult> GetDadosDashBoardTipoFornecimento(DateTime dataInicio, DateTime dataFim)
        {
            List<string> ListaTipoFornecimento = new List<string>();
            List<ContaDto> ListaValor = new List<ContaDto>();
            List<DataPoints> ListaResult = new List<DataPoints>();
            BuildArrayChart buildArrayChart = new BuildArrayChart();
            List<BuildArrayChart> retorno = new List<BuildArrayChart>();
            try
            {
                int userIdToken = User.GetUserId();
                if (userIdToken >= 1)
                {
                    var Contas = await _dashboardService.GetDadosDashBoardTipoFornecimentoAsync(dataInicio, dataFim);
                    if (Contas == null)
                    {
                        return NoContent();
                    }
                    
                    foreach (var item in Contas.Select(x => new { x.TipoFornecimento }).GroupBy(x => x.TipoFornecimento))
                    {
                        ListaTipoFornecimento.Add(item.Key);
                    }

                    foreach (var tipoFornecimento in ListaTipoFornecimento)
                    {
                        foreach (var conta in Contas
                                        .Select(x => new {TipoFornecimento = x.TipoFornecimento, AnoMes = x.AnoMes, Valor = x.Valor})
                                        .Where(x => x.TipoFornecimento == tipoFornecimento)
                                        .GroupBy(x => x.TipoFornecimento)
                                        .ToList())
                        {
                            ListaResult = new List<DataPoints>();
                            
                            for (int i = 0; i < conta.Count(); i++)
                            {
                                var dataPoint = new DataPoints();    
                                dataPoint.Description = conta.ToArray()[i].AnoMes.ToString();
                                dataPoint.Value = conta.ToArray()[i].Valor;
                                ListaResult.Add(dataPoint);
                            }
                            
                            buildArrayChart = new BuildArrayChart(){ Target = tipoFornecimento, dataPoints = ListaResult }; 
                            retorno.Add(buildArrayChart);
                        }

                        
                    }

                    return Ok(new { dados = retorno }); 
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