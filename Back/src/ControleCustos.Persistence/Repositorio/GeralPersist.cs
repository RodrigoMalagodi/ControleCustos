using System.Threading.Tasks;
using ControleCustos.Persistence.Contratos;
using ControleCustos.Persistence.Contexto;

namespace ControleCustos.Persistence.Repositorio
{
    public class GeralPersist : IGeralPersist
    {
        private readonly ControleCustosContext _context;

        public GeralPersist(ControleCustosContext context)
        {
            _context = context;
        }

        #region Geral
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public void DeleteRange<T>(T[] entityArray) where T : class
        {
            _context.RemoveRange(entityArray);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }
        #endregion

    }
}