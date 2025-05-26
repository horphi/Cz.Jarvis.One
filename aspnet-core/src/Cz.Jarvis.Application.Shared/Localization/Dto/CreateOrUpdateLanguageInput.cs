using System.ComponentModel.DataAnnotations;

namespace Cz.Jarvis.Localization.Dto
{
    public class CreateOrUpdateLanguageInput
    {
        [Required]
        public ApplicationLanguageEditDto Language { get; set; }
    }
}