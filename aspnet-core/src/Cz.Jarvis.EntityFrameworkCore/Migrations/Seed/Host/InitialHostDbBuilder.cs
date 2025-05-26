using Cz.Jarvis.EntityFrameworkCore;

namespace Cz.Jarvis.Migrations.Seed.Host
{
    public class InitialHostDbBuilder
    {
        private readonly JarvisDbContext _context;

        public InitialHostDbBuilder(JarvisDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            new DefaultLanguagesCreator(_context).Create();
            new HostRoleAndUserCreator(_context).Create();
            new DefaultSettingsCreator(_context).Create();

            _context.SaveChanges();
        }
    }
}
