using System.Collections.Generic;
using Cz.Jarvis.Authorization.Users.Dto;
using Cz.Jarvis.Dto;

namespace Cz.Jarvis.Authorization.Users.Exporting
{
    public interface IUserListExcelExporter
    {
        FileDto ExportToFile(List<UserListDto> userListDtos, List<string> selectedColumns);
    }
}