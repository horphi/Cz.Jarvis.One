using System.Collections.Generic;
using Abp;
using Cz.Jarvis.Chat.Dto;
using Cz.Jarvis.Dto;

namespace Cz.Jarvis.Chat.Exporting
{
    public interface IChatMessageListExcelExporter
    {
        FileDto ExportToFile(UserIdentifier user, List<ChatMessageExportDto> messages);
    }
}
