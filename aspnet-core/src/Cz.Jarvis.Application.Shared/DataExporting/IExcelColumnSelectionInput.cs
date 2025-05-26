using System.Collections.Generic;

namespace Cz.Jarvis.DataExporting
{
    public interface IExcelColumnSelectionInput
    {
        List<string> SelectedColumns { get; set; }
    }
}