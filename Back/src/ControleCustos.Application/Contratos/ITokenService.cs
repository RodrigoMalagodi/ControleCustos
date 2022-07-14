using System.Threading.Tasks;
using ControleCustos.Application.Dtos;

namespace ControleCustos.Application.Contratos
{
    public interface ITokenService
    {
        Task<string> CreateToken(UserUpdateDto userUpdateDto);
    }
}