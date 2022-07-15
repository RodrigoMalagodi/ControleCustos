using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ControleCustos.Application.Contratos;
using System;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using ControleCustos.Application.Dtos;
using System.Security.Claims;
using ControleCustos.API.Extensions;

namespace ControleCustos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        
        private readonly IAccountService _accountService;
        private readonly ITokenService _tokenService;

        public AccountController(
            IAccountService accountService,
            ITokenService tokenService
        )
        {
            _accountService = accountService;
            _tokenService = tokenService;
        }

        [HttpGet("GetUser")]
        public async Task<IActionResult> GetUser()
        {
            try
            {
                var userName = User.GetUserName();

                var user = await _accountService.GetUserByUserNameAsync(userName);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar Usuário. Erro: {ex.Message}"
                );
            }
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserLoginDto userLoginDto)
        {
            try
            {
                var user = await _accountService.GetUserByUserNameAsync(userLoginDto.UserName);

                if (user == null)
                    return Unauthorized("Usuário ou Senha Inválido.");

                var result = await _accountService.CheckUserPasswordAsync(
                    user,
                    userLoginDto.Password
                );

                if (!result.Succeeded)
                    return Unauthorized("Usuário ou Senha Inválido.");

                return Ok(
                    new
                    {
                        userName = user.UserName,
                        Nome = user.Nome,
                        token = _tokenService.CreateToken(user).Result
                    }
                );
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar recuperar Usuário. Erro: {ex.Message}"
                );
            }
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterUser(UserUpdateDto userDto)
        {
            try
            {
                if (await _accountService.UserExists(userDto.UserName))
                    return BadRequest("Usuário já existe.");

                var userRetorno = await _accountService.CreateAccountAsync(userDto);

                if (userRetorno != null)
                    return Ok(
                        new
                        {
                            userName = userRetorno.UserName,
                            Nome = userRetorno.Nome,
                            token = _tokenService.CreateToken(userRetorno).Result
                        }
                    );

                return BadRequest("Usuário não criado. Tente novamente mais tarde.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar Cadastrar Usuário. Erro: {ex.Message}"
                );
            }
        }

        [HttpPut("UpdateUser")]
        public async Task<IActionResult> UpdateUser(UserUpdateDto userUpdateDto)
        {
            try
            {
                if (userUpdateDto.UserName != User.GetUserName())
                    return Unauthorized("Usuário Inválido.");

                userUpdateDto.Id = User.GetUserId();

                var user = await _accountService.GetUserByUserNameAsync(User.GetUserName());
                if (user == null)
                    return Unauthorized("Usuário Inválido.");

                var userRetorno = await _accountService.UpdateAccount(userUpdateDto);
                if (userRetorno == null)
                    return NoContent();

                return Ok(
                    new
                    {
                        userName = userRetorno.UserName,
                        Nome = userRetorno.Nome,
                        token = _tokenService.CreateToken(userRetorno).Result
                    }
                );
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar atualizar Usuário. Erro: {ex.Message}"
                );
            }
        }

        
    }
}
