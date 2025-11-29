namespace Abp.Runtime.Session
{
    public class SessionOverride
    {
        public long? UserId { get; }

        public SessionOverride(long? userId)
        {
            UserId = userId;
        }
    }
}