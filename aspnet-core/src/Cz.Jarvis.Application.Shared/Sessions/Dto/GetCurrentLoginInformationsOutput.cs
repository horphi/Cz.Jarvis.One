namespace Cz.Jarvis.Sessions.Dto
{
    public class GetCurrentLoginInformationsOutput
    {
        public UserLoginInfoDto User { get; set; }

        public UserLoginInfoDto ImpersonatorUser { get; set; }

        public ApplicationInfoDto Application { get; set; }

    }
}