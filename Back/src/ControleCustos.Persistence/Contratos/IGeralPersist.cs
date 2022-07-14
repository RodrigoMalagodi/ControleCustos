using System.Threading.Tasks;
using ControleCustos.Domain;

namespace ControleCustos.Persistence.Contratos
{
    public interface IGeralPersist
    {
        #region Geral
        void Add<T>(T Entity) where T : class;
        void Update<T>(T Entity) where T : class;
        void Delete<T>(T Entity) where T : class;
        void DeleteRange<T>(T[] Entity) where T : class;

        Task<bool> SaveChangesAsync();
        #endregion

    }
}