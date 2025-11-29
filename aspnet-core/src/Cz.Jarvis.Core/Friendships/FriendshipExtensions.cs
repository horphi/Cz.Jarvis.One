using Abp;

namespace Cz.Jarvis.Friendships
{
    public static class FriendshipExtensions
    {
        public static UserIdentifier ToUserIdentifier(this Friendship friendship)
        {
            return new UserIdentifier(null, friendship.UserId);
        }

        public static UserIdentifier ToFriendIdentifier(this Friendship friendship)
        {
            return new UserIdentifier(null, friendship.FriendUserId);
        }
    }
}
