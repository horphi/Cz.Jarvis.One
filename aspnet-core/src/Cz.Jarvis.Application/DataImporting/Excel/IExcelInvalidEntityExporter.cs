using System.Collections.Generic;
using Abp.Dependency;
using Cz.Jarvis.Dto;

namespace Cz.Jarvis.DataImporting.Excel;

public interface IExcelInvalidEntityExporter<TEntityDto> : ITransientDependency
{
    FileDto ExportToFile(List<TEntityDto> entities);
}