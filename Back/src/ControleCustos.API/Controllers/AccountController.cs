using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ControleCustos.Application.Contratos;
using System;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using ControleCustos.Application.Dtos;
using ControleCustos.API.Extensions;
using ControleCustos.API.Helpers;

namespace ControleCustos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        
        private readonly string _destino = "Images/Users";
        private readonly IAccountService _accountService;
        private readonly ITokenService _tokenService;
        private readonly IUtil _iUtil;

        public AccountController(
            IAccountService accountService,
            ITokenService tokenService,
            IUtil iUtil
        )
        {
            _iUtil = iUtil;
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

          [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage()
        {
            try
            {
                int userIdToken = User.GetUserId();
                if (userIdToken >= 1)
                {
                    string userName = User.GetUserName();

                    var user = await _accountService.GetUserByUserNameAsync(
                        userName
                    );
                    if (user == null)
                    {
                        return NoContent();
                    }

                    var file = Request.Form.Files[0];

                    if (file.Length > 0)
                    {
                        if (!string.IsNullOrEmpty(user.ImagemURL))
                        {
                            _iUtil.DeleteImage(user.ImagemURL, _destino);
                        }
                        user.ImagemURL = await _iUtil.SaveImage(file, _destino);
                    }

                    var UserRetorno = await _accountService.UpdateAccount(user);

                    return Ok(UserRetorno);
                }

                return BadRequest("Erro ao tentar atualizar imagem do usuário.");
            }
            catch (Exception ex)
            {
                return this.StatusCode(
                    StatusCodes.Status500InternalServerError,
                    $"Erro ao tentar adicionar imagem ao usuário. Erro: {ex.Message}"
                );
            }
        }
        
    }
}
