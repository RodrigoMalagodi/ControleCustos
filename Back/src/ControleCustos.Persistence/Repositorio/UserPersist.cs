using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ControleCustos.Domain.Identity;
using ControleCustos.Persistence.Contratos;
using ControleCustos.Persistence.Contexto;

namespace ControleCustos.Persistence.Repositorio
{
    public class UserPersist : GeralPersist, IUserPersist
    {
        private readonly ControleCustosContext _context;

        public UserPersist(ControleCustosContext context) : base(context)
        {
            this._context = context;
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User> GetUserByUserNameAsync(string userName)
        {
            return await _context.Users.SingleOrDefaultAsync(x => x.UserName.ToLower().Equals(userName.ToLower()));
        }

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }
    }
}
