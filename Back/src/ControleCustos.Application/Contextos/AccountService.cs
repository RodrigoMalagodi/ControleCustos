using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ControleCustos.Application.Dtos;
using ControleCustos.Domain.Identity;
using ControleCustos.Persistence.Contratos;

namespace ControleCustos.Application.Contratos
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IMapper _mapper;
        private readonly IUserPersist _userPersist;

        public AccountService(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IMapper mapper,
            IUserPersist userPersist
        )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _userPersist = userPersist;
        }

        public async Task<SignInResult> CheckUserPasswordAsync(
            UserUpdateDto userUpdateDto,
            string password
        )
        {
            try
            {
                var user = await _userManager.Users.SingleOrDefaultAsync(
                    x => x.UserName.ToLower().Equals(userUpdateDto.UserName.ToLower())
                );

                return await _signInManager.CheckPasswordSignInAsync(user, password, false);
            }
            catch (Exception ex)
            {
                throw new Exception(
                    $"Erro ao tentar verificar o password. Erro: {ex.Message}"
                );
            }
        }

        public async Task<UserUpdateDto> CreateAccountAsync(UserUpdateDto userUpdateDto)
        {
            try
            {
                var user = _mapper.Map<User>(userUpdateDto);
                var result = await _userManager.CreateAsync(user, userUpdateDto.Password);

                if (result.Succeeded)
                {
                    var userToReturn = _mapper.Map<UserUpdateDto>(user);
                    return userToReturn;
                }

                return null;
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao tentar Criar Usuário. Erro: {ex.Message}");
            }
        }

        public async Task<UserUpdateDto> GetUserByUserNameAsync(string userName)
        {
            try
            {
                var user = await _userPersist.GetUserByUserNameAsync(userName);
                if (user == null){return null;}

                var userUpdateDto = _mapper.Map<UserUpdateDto>(user);
                return userUpdateDto;

            }
            catch (Exception ex)
            {
                throw new Exception(
                    $"Erro ao tentar verificar o usuário pelo nome. Erro: {ex.Message}"
                );
            }
        }

        public async Task<UserUpdateDto> UpdateAccount(UserUpdateDto userUpdateDto)
        {
            try 
            {   
                var user = await _userPersist.GetUserByUserNameAsync(userUpdateDto.UserName);
                if (user == null){return null;}

                _mapper.Map(userUpdateDto, user);

                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                string passwordUser  = !string.IsNullOrEmpty(userUpdateDto.Password) ? userUpdateDto.Password : "";
                await _userManager.ResetPasswordAsync(user, token, passwordUser);

                _userPersist.Update<User>(user);

                if(await _userPersist.SaveChangesAsync())
                {
                    var userRetorno = await _userPersist.GetUserByUserNameAsync(user.UserName);
                    return _mapper.Map<UserUpdateDto>(userRetorno);
                }

                return null;

            }
            catch (Exception ex)
            {
                throw new Exception(
                    $"Erro ao tentar atualizar o usuário. Erro: {ex.Message}"
                );
            }
        }

        public async Task<bool> UserExists(string userName)
        {
            try 
            { 
                return await _userManager.Users.AnyAsync(user => user.UserName.ToLower().Equals(userName.ToLower()));
            }
            catch (Exception ex)
            {
                throw new Exception(
                    $"Erro ao tentar verificar se usuário existe. Erro: {ex.Message}"
                );
            }
        }
    }
}
