using Cz.Jarvis.Sessions.Dto;

namespace Cz.Jarvis.Web.Models.Ui
{
    public class HomePageModel
    {
        public bool IsMultiTenancyEnabled { get; set; }

        public GetCurrentLoginInformationsOutput LoginInformation { get; set; }

        public string GetShownLoginName()
        {
            var userName = "<span id=\"HeaderCurrentUserName\">" + LoginInformation.User.UserName + "</span>";

            if (!IsMultiTenancyEnabled)
            {
                return userName;
            }

            return "<span class='tenancy-name'>.\\</span>" + userName;
        }
    }
}
