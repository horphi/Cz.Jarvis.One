using System.ComponentModel.DataAnnotations;

namespace Cz.Jarvis.Authorization.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}
