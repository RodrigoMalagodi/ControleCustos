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

        // [HttpGet("fornecedor/{dataInicio}/{dataFim}")]
        // public async Task<IActionResult> GetDadosDashBoardFornecedor(DateTime dataInicio, DateTime dataFim)
        // {
        //     List<int> ListaAnoMes = new List<int>();
        //     List<ContaDto> ListaValor = new List<ContaDto>();
        //     List<DataPoints> ListaResult = new List<DataPoints>();
        //     List<DataPoints> ListaRetorno = new List<DataPoints>();
        //     BuildArrayChart buildArrayChart = new BuildArrayChart();
        //     List<BuildArrayChart> retorno = new List<BuildArrayChart>();

         
            
        //     try
        //     {
        //         int userIdToken = User.GetUserId();
        //         if (userIdToken >= 1)
        //         {
        //             var Contas = await _dashboardService.GetDadosDashBoardFornecedorAsync(dataInicio, dataFim);
        //             if (Contas == null)
        //             {
        //                 return NoContent();
        //             }
                    
        //             foreach (var item in Contas.Select(x => new { x.AnoMes }).GroupBy(x => x.AnoMes))
        //             {
        //                 ListaAnoMes.Add(item.Key);
        //             }

        //             foreach (var anoMes in ListaAnoMes)
        //             {
        //                 foreach (var conta in Contas
        //                                 .Select(x => new {NomeFornecedor = x.Descricao, AnoMes = x.AnoMes, Valor = x.Valor, Juros = x.Juros})
        //                                 .Where(x => x.AnoMes == anoMes)
        //                                 .OrderBy(x => x.NomeFornecedor)
        //                                 .GroupBy(x => new { x.AnoMes })
        //                                 .ToList())
        //                 {
        //                     ListaResult = new List<DataPoints>();
        //                     for (int i = 0; i < conta.Count(); i++)
        //                     {
        //                         var dataPoint = new DataPoints();
        //                         dataPoint.Description = conta.ToArray()[i].NomeFornecedor;
        //                         foreach (var item in conta.Where(x =>x.NomeFornecedor == dataPoint.Description))
        //                         {
        //                             dataPoint.Value += (item.Valor + item.Juros);
        //                         }
        //                         ListaResult.Add(dataPoint);
        //                     }

        //                     ListaRetorno = new List<DataPoints>();
        //                     foreach (var item in  ListaResult
        //                                                 .Select(x => new {Description = x.Description, Value = x.Value})
        //                                                 .GroupBy(x => new { x.Description, x.Value }))
        //                     {

        //                         var dataPointResult = new DataPoints();
        //                         dataPointResult.Description = item.Key.Description;
        //                         dataPointResult.Value = item.Key.Value;
        //                         ListaRetorno.Add(dataPointResult);
        //                     }
    
        //                     buildArrayChart = new BuildArrayChart(){ Target = anoMes.ToString(), dataPoints = ListaRetorno}; 
        //                     retorno.Add(buildArrayChart);
        //                 }
        //             }

        //             return Ok(new { dados = retorno }); 
        //         }

        //         return BadRequest("Erro ao tentar recuperar dados.");
        //     }
        //     catch (Exception ex)
        //     {
        //         return this.StatusCode(
        //             StatusCodes.Status500InternalServerError,
        //             $"Erro ao tentar recuperar dados. Erro: {ex.Message}"
        //         );
        //     }

        // }

        // [HttpGet("tipoCusto/{dataInicio}/{dataFim}")]
        // public async Task<IActionResult> GetDadosDashBoardTipoCusto(DateTime dataInicio, DateTime dataFim)
        // {
        //     List<string> ListaTipoCusto = new List<string>();
        //     List<int> ListaAnoMes = new List<int>();
        //     List<ContaDto> ListaValor = new List<ContaDto>();
        //     List<DataPoints> ListaResult = new List<DataPoints>();
        //     List<DataPoints> ListaRetorno = new List<DataPoints>();
        //     BuildArrayChart buildArrayChart = new BuildArrayChart();
        //     List<BuildArrayChart> retorno = new List<BuildArrayChart>();

        //     int anoMesInicio = FormataAnoMes(dataInicio);
        //     int anoMesFim = FormataAnoMes(dataFim);

        //     string[] tipo = new string[] { "Fixo", "Variável" };

        //     foreach (var item in tipo)
        //     {
        //         for (int i = anoMesInicio; i <=  anoMesFim; i++)
        //         {
        //             var x = new ContaDto();
        //             x.AnoMes = i;
        //             x.TipoCusto = item;
        //             ListaValor.Add(x);
        //         }
        //     }
            
        //     try
        //     {
        //         int userIdToken = User.GetUserId();
        //         if (userIdToken >= 1)
        //         {
        //             var Contas = await _dashboardService.GetDadosDashBoardTipoCustoAsync(dataInicio, dataFim);
        //             if (Contas == null)
        //             {
        //                 return NoContent();
        //             }
                    
        //             foreach (var item in Contas.Select(x => new { x.TipoCusto }).GroupBy(x => x.TipoCusto))
        //             {
        //                 ListaTipoCusto.Add(item.Key);
        //             }

        //             foreach (var tipoCusto in ListaTipoCusto)
        //             {
        //                 foreach (var conta in Contas
        //                                 .Select(x => new {TipoCusto = x.TipoCusto, AnoMes = x.AnoMes, Valor = x.Valor, Juros = x.Juros})
        //                                 .Where(x => x.TipoCusto == tipoCusto)
        //                                 .OrderBy(x => x.TipoCusto)
        //                                 .GroupBy(x => new { x.TipoCusto })
        //                                 .ToList())
        //                 {
        //                     ListaResult = new List<DataPoints>();
        //                     for (int i = 0; i < conta.Count(); i++)
        //                     {
        //                         var dataPoint = new DataPoints();
        //                         dataPoint.Description = conta.ToArray()[i].AnoMes.ToString();
        //                         foreach (var item in conta.Where(x => x.AnoMes.ToString() == dataPoint.Description))
        //                         {
        //                             dataPoint.Value += (item.Valor + item.Juros);
        //                         }
        //                         ListaResult.Add(dataPoint);
        //                     }

        //                     ListaRetorno = new List<DataPoints>();
        //                     foreach (var item in  ListaResult
        //                                                 .Select(x => new { Description = x.Description, Value = x.Value })
        //                                                 .GroupBy(x => new { x.Description, x.Value }))
        //                     {
        //                         var dataPointResult = new DataPoints();
        //                         dataPointResult.Description = item.Key.Description;
        //                         dataPointResult.Value = item.Key.Value;
        //                         ListaRetorno.Add(dataPointResult);
        //                     }
    
        //                     buildArrayChart = new BuildArrayChart(){ Target = tipoCusto, dataPoints = ListaRetorno}; 
        //                     retorno.Add(buildArrayChart);
        //                 }
        //             }

        //             foreach (var item in ListaValor)
        //             {
        //                 for (int r = 0; r < retorno.Count(); r ++)
        //                 {
        //                     for (int d = 0; d < retorno[r].dataPoints.Count(); d++)
        //                     {
        //                         int aMes = item.AnoMes;
        //                         string tCusto = retorno[r].Target;
        //                         var x = ListaValor.Where(x => x.AnoMes == aMes && x.TipoCusto == tCusto).FirstOrDefault();

        //                         if(x == null)
        //                         {
        //                             var dataPointResult = new DataPoints();
        //                             dataPointResult.Description = item.TipoCusto;
        //                             dataPointResult.Value = 0;
        //                             ListaRetorno.Add(dataPointResult);
        //                         }
        //                     }

        //                     buildArrayChart = new BuildArrayChart(){ Target = item.TipoCusto, dataPoints = ListaRetorno}; 
        //                     retorno.Add(buildArrayChart);
        //                 }

        //             }

        //             return Ok(new { dados = retorno.OrderBy(x => x.Target).GroupBy(x => x.Target) }); 
        //         }
        //         return BadRequest("Erro ao tentar recuperar dados.");
        //     }
        //     catch (Exception ex)
        //     {
        //         return this.StatusCode(
        //             StatusCodes.Status500InternalServerError,
        //             $"Erro ao tentar recuperar dados. Erro: {ex.Message}"
        //         );
        //     }

        // }

        // [HttpGet("tipoFornecimento/{dataInicio}/{dataFim}")]
        // public async Task<IActionResult> GetDadosDashBoardTipoFornecimento(DateTime dataInicio, DateTime dataFim)
        // {
        //     List<int> ListaAnoMes = new List<int>();
        //     List<ContaDto> ListaValor = new List<ContaDto>();
        //     List<DataPoints> ListaResult = new List<DataPoints>();
        //     List<DataPoints> ListaRetorno = new List<DataPoints>();
        //     BuildArrayChart buildArrayChart = new BuildArrayChart();
        //     List<BuildArrayChart> retorno = new List<BuildArrayChart>();
        //     try
        //     {
        //         int userIdToken = User.GetUserId();
        //         if (userIdToken >= 1)
        //         {
        //             var Contas = await _dashboardService.GetDadosDashBoardTipoFornecimentoAsync(dataInicio, dataFim);
        //             if (Contas == null)
        //             {
        //                 return NoContent();
        //             }
                    
        //             foreach (var item in Contas.Select(x => new { x.AnoMes }).GroupBy(x => x.AnoMes))
        //             {
        //                 ListaAnoMes.Add(item.Key);
        //             }

        //             foreach (var anoMes in ListaAnoMes)
        //             {
        //                 foreach (var conta in Contas
        //                                 .Select(x => new {Descricao = x.Descricao, AnoMes = x.AnoMes, Valor = x.Valor, Juros = x.Juros})
        //                                 .Where(x => x.AnoMes == anoMes)
        //                                 .OrderBy(x => x.Descricao)
        //                                 .GroupBy(x => new { x.AnoMes })
        //                                 .ToList())
        //                 {
        //                     ListaResult = new List<DataPoints>();
        //                     for (int i = 0; i < conta.Count(); i++)
        //                     {
        //                         var dataPoint = new DataPoints();
        //                         dataPoint.Description = conta.ToArray()[i].Descricao;
        //                         foreach (var item in conta.Where(x =>x.Descricao == dataPoint.Description))
        //                         {
        //                             dataPoint.Value += (item.Valor + item.Juros);
        //                         }
        //                         ListaResult.Add(dataPoint);
        //                     }

        //                     ListaRetorno = new List<DataPoints>();
        //                     foreach (var item in  ListaResult
        //                                                 .Select(x => new {Description = x.Description, Value = x.Value})
        //                                                 .GroupBy(x => new { x.Description, x.Value }))
        //                     {

        //                         var dataPointResult = new DataPoints();
        //                         dataPointResult.Description = item.Key.Description;
        //                         dataPointResult.Value = item.Key.Value;
        //                         ListaRetorno.Add(dataPointResult);
        //                     }
    
        //                     buildArrayChart = new BuildArrayChart(){ Target = anoMes.ToString(), dataPoints = ListaRetorno}; 
        //                     retorno.Add(buildArrayChart);
        //                 }
        //             }

        //             return Ok(new { dados = retorno }); 
        //         }
        //         return BadRequest("Erro ao tentar recuperar dados.");
        //     }
        //     catch (Exception ex)
        //     {
        //         return this.StatusCode(
        //             StatusCodes.Status500InternalServerError,
        //             $"Erro ao tentar recuperar dados. Erro: {ex.Message}"
        //         );
        //     }

        // }

        // private int FormataAnoMes(DateTime date){
        //     string month = date.Month < 10 ? "0" + date.Month.ToString() : date.Month.ToString();
        //     string year = date.Year.ToString();
        //     return int.Parse(year + month);
        // }

    }
}