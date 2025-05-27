using Cz.Jarvis.EntityFrameworkCore;

namespace Cz.Jarvis.Test.Base.TestData
{
    public class TestDataBuilder
    {
        private readonly JarvisDbContext _context;
        private readonly int _tenantId;

        public TestDataBuilder(JarvisDbContext context, int tenantId)
        {
            _context = context;
            _tenantId = tenantId;
        }

        public void Create()
        {
            

            _context.SaveChanges();
        }
    }
}
