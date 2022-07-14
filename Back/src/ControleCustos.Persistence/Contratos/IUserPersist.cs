using System.Collections.Generic;
using System.Threading.Tasks;
using ControleCustos.Domain.Identity;

namespace ControleCustos.Persistence.Contratos
{
    public interface IUserPersist : IGeralPersist
    {
        Task<IEnumerable<User>> GetUsersAsync();
        Task<User> GetUserByIdAsync(int id);
        Task<User> GetUserByUserNameAsync(string userName);
    }
}