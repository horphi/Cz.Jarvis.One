using System.Collections.Generic;
using Abp.Auditing;

namespace Cz.Jarvis.Auditing
{
    public interface IExpiredAndDeletedAuditLogBackupService
    {
        bool CanBackup();
        
        void Backup(List<AuditLog> auditLogs);
    }
}