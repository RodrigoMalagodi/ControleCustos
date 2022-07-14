using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace ControleCustos.Domain.Identity
{
    public class User : IdentityUser<int>
    {
        public string Nome { get; set; }
        public IEnumerable<UserRole> UserRoles { get; set; }
    }
}