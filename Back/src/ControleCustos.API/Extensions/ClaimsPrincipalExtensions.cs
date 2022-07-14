using System.Security.Claims;

namespace ControleCustos.API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetUserName(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Name)?.Value;
        }

        public static int GetUserId(this ClaimsPrincipal user)
        {
            if (user.FindFirst(ClaimTypes.NameIdentifier)?.Value != null)
            {
                return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            }
            else
            {
                return 0;
            }
        }
    }
}
