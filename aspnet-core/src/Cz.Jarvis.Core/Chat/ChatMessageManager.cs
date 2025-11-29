using Abp;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.MultiTenancy;
using Abp.RealTime;
using Abp.UI;
using Cz.Jarvis.Authorization.Users;
using Cz.Jarvis.Friendships;
using Cz.Jarvis.Friendships.Cache;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Cz.Jarvis.Chat
{
    [AbpAuthorize]
    public class ChatMessageManager : JarvisDomainServiceBase, IChatMessageManager    
    {
        private readonly IFriendshipManager _friendshipManager;
        private readonly IChatCommunicator _chatCommunicator;
        private readonly IOnlineClientManager _onlineClientManager;
        private readonly UserManager _userManager;
        private readonly IUserFriendsCache _userFriendsCache;
        private readonly IUserEmailer _userEmailer;
        private readonly IRepository<ChatMessage, long> _chatMessageRepository;
        private readonly IChatFeatureChecker _chatFeatureChecker;
        private readonly IUnitOfWorkManager _unitOfWorkManager;

        public ChatMessageManager(
            IFriendshipManager friendshipManager,
            IChatCommunicator chatCommunicator,
            IOnlineClientManager onlineClientManager,
            UserManager userManager,
            IUserFriendsCache userFriendsCache,
            IUserEmailer userEmailer,
            IRepository<ChatMessage, long> chatMessageRepository,
            IChatFeatureChecker chatFeatureChecker,
            IUnitOfWorkManager unitOfWorkManager)
        {
            _friendshipManager = friendshipManager;
            _chatCommunicator = chatCommunicator;
            _onlineClientManager = onlineClientManager;
            _userManager = userManager;
            _userFriendsCache = userFriendsCache;
            _userEmailer = userEmailer;
            _chatMessageRepository = chatMessageRepository;
            _chatFeatureChecker = chatFeatureChecker;
            _unitOfWorkManager = unitOfWorkManager;
        }

        public async Task SendMessageAsync(UserIdentifier sender, UserIdentifier receiver, string message,
            string senderTenancyName, string senderUserName, Guid? senderProfilePictureId)
        {
            CheckReceiverExists(receiver);

            _chatFeatureChecker.CheckChatFeatures(null, null); // Multi-tenancy removed

            var friendshipState = (await _friendshipManager.GetFriendshipOrNullAsync(sender, receiver))?.State;
            if (friendshipState == FriendshipState.Blocked)
            {
                throw new UserFriendlyException(L("UserIsBlocked"));
            }

            var sharedMessageId = Guid.NewGuid();

            await HandleSenderToReceiverAsync(sender, receiver, message, sharedMessageId);
            await HandleReceiverToSenderAsync(sender, receiver, message, sharedMessageId);
            await HandleSenderUserInfoChangeAsync(sender, receiver, senderTenancyName, senderUserName,
                senderProfilePictureId);
        }

        private void CheckReceiverExists(UserIdentifier receiver)
        {
            var receiverUser = _userManager.GetUserOrNull(receiver);
            if (receiverUser == null)
            {
                throw new UserFriendlyException(L("TargetUserNotFoundProbablyDeleted"));
            }
        }

        public virtual long Save(ChatMessage message)
        {
            return _unitOfWorkManager.WithUnitOfWork(() =>
            {
                return _chatMessageRepository.InsertAndGetId(message);
            });
        }

        public virtual int GetUnreadMessageCount(UserIdentifier sender, UserIdentifier receiver)
        {
            return _unitOfWorkManager.WithUnitOfWork(() =>
            {
                return _chatMessageRepository.Count(cm => cm.UserId == receiver.UserId &&
                                                          cm.TargetUserId == sender.UserId &&
                                                          cm.ReadState == ChatMessageReadState.Unread);
            });
        }

        public async Task<ChatMessage> FindMessageAsync(int id, long userId)
        {
            return await _chatMessageRepository.FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);
        }

        private async Task HandleSenderToReceiverAsync(UserIdentifier senderIdentifier,
            UserIdentifier receiverIdentifier, string message, Guid sharedMessageId)
        {
            var friendshipState =
                (await _friendshipManager.GetFriendshipOrNullAsync(senderIdentifier, receiverIdentifier))?.State;
            if (friendshipState == null)
            {
                friendshipState = FriendshipState.Accepted;

                var receiverUser = await _userManager.GetUserAsync(receiverIdentifier);
                await _friendshipManager.CreateFriendshipAsync(
                    new Friendship(
                        senderIdentifier,
                        receiverIdentifier,
                        receiverUser.UserName,
                        receiverUser.ProfilePictureId,
                        friendshipState.Value)
                );
            }

            if (friendshipState.Value == FriendshipState.Blocked)
            {
                //Do not send message if receiver banned the sender
                return;
            }

            var sentMessage = new ChatMessage(
                senderIdentifier,
                receiverIdentifier,
                ChatSide.Sender,
                message,
                ChatMessageReadState.Read,
                sharedMessageId,
                ChatMessageReadState.Unread
            );

            Save(sentMessage);

            await _chatCommunicator.SendMessageToClient(
                await _onlineClientManager.GetAllByUserIdAsync(senderIdentifier),
                sentMessage
            );
        }

        private async Task HandleReceiverToSenderAsync(UserIdentifier senderIdentifier,
            UserIdentifier receiverIdentifier, string message, Guid sharedMessageId)
        {
            var friendship = await _friendshipManager.GetFriendshipOrNullAsync(receiverIdentifier, senderIdentifier);
            var friendshipState = friendship?.State;
            var clients = await _onlineClientManager.GetAllByUserIdAsync(receiverIdentifier);

            if (friendshipState == null)
            {
                var senderUser = await _userManager.GetUserAsync(senderIdentifier);

                friendship = new Friendship(
                    receiverIdentifier,
                    senderIdentifier,
                    senderUser.UserName,
                    senderUser.ProfilePictureId,
                    FriendshipState.Accepted
                );

                await _friendshipManager.CreateFriendshipAsync(friendship);

                if (clients.Any())
                {
                    var isFriendOnline = await _onlineClientManager.IsOnlineAsync(receiverIdentifier);
                    await _chatCommunicator.SendFriendshipRequestToClient(clients, friendship, false, isFriendOnline);
                }
            }

            if (friendshipState == FriendshipState.Blocked)
            {
                //Do not send message if receiver banned the sender
                return;
            }

            var sentMessage = new ChatMessage(
                receiverIdentifier,
                senderIdentifier,
                ChatSide.Receiver,
                message,
                ChatMessageReadState.Unread,
                sharedMessageId,
                ChatMessageReadState.Read
            );

            Save(sentMessage);

            if (clients.Any())
            {
                await _chatCommunicator.SendMessageToClient(clients, sentMessage);
            }
            else if (GetUnreadMessageCount(senderIdentifier, receiverIdentifier) == 1)
            {
                await _userEmailer.TryToSendChatMessageMail(
                    await _userManager.GetUserAsync(receiverIdentifier),
                    (await _userManager.GetUserAsync(senderIdentifier)).UserName,
                    null, // Multi-tenancy removed
                    sentMessage
                );
            }
        }

        private async Task HandleSenderUserInfoChangeAsync(UserIdentifier sender, UserIdentifier receiver,
            string senderTenancyName, string senderUserName, Guid? senderProfilePictureId)
        {
            var receiverCacheItem = _userFriendsCache.GetCacheItemOrNull(receiver);

            var senderAsFriend = receiverCacheItem?.Friends.FirstOrDefault(f =>
                f.FriendUserId == sender.UserId);
            if (senderAsFriend == null)
            {
                return;
            }

            if (senderAsFriend.FriendUserName == senderUserName &&
                senderAsFriend.FriendProfilePictureId == senderProfilePictureId)
            {
                return;
            }

            var friendship = (await _friendshipManager.GetFriendshipOrNullAsync(receiver, sender));
            if (friendship == null)
            {
                return;
            }

            friendship.FriendUserName = senderUserName;
            friendship.FriendProfilePictureId = senderProfilePictureId;

            await _friendshipManager.UpdateFriendshipAsync(friendship);
        }
    }
}