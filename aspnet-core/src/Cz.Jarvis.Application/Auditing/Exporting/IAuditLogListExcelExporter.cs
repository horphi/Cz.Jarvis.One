using Cz.Jarvis.Auditing.Dto;
using Cz.Jarvis.Dto;
using Cz.Jarvis.EntityChanges.Dto;
using System.Collections.Generic;

namespace Cz.Jarvis.Auditing.Exporting
{
    public interface IAuditLogListExcelExporter
    {
        FileDto ExportToFile(List<AuditLogListDto> auditLogListDtos);

        FileDto ExportToFile(List<EntityChangeListDto> entityChangeListDtos);
    }
}
