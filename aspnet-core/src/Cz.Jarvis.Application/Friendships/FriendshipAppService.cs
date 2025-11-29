using System.Linq;
using System.Threading.Tasks;
using Abp;
using Abp.Authorization;
using Abp.Extensions;
using Abp.MultiTenancy;
using Abp.RealTime;
using Abp.Runtime.Session;
using Abp.UI;
using Cz.Jarvis.Authorization.Users;
using Cz.Jarvis.Chat;
using Cz.Jarvis.Friendships.Dto;

namespace Cz.Jarvis.Friendships
{
    [AbpAuthorize]
    public class FriendshipAppService : JarvisAppServiceBase, IFriendshipAppService
    {
        private readonly IFriendshipManager _friendshipManager;
        private readonly IOnlineClientManager _onlineClientManager;
        private readonly IChatCommunicator _chatCommunicator;
        private readonly IChatFeatureChecker _chatFeatureChecker;

        public FriendshipAppService(
            IFriendshipManager friendshipManager,
            IOnlineClientManager onlineClientManager,
            IChatCommunicator chatCommunicator,
            IChatFeatureChecker chatFeatureChecker)
        {
            _friendshipManager = friendshipManager;
            _onlineClientManager = onlineClientManager;
            _chatCommunicator = chatCommunicator;
            _chatFeatureChecker = chatFeatureChecker;
        }

        public async Task<FriendDto> CreateFriendshipRequest(CreateFriendshipRequestInput input)
        {
            var userIdentifier = AbpSession.ToUserIdentifier();
            var probableFriend = new UserIdentifier(input.TenantId, input.UserId);

            _chatFeatureChecker.CheckChatFeatures(userIdentifier.TenantId, probableFriend.TenantId);

            if (await _friendshipManager.GetFriendshipOrNullAsync(userIdentifier, probableFriend) != null)
            {
                throw new UserFriendlyException(L("YouAlreadySentAFriendshipRequestToThisUser"));
            }

            var user = await UserManager.FindByIdAsync(AbpSession.GetUserId().ToString());

            var probableFriendUser = await UserManager.FindByIdAsync(input.UserId.ToString());

            // Friend requester
            var sourceFriendship = new Friendship(userIdentifier, probableFriend,
                probableFriendUser.UserName, probableFriendUser.ProfilePictureId, FriendshipState.Accepted);
            await _friendshipManager.CreateFriendshipAsync(sourceFriendship);

            // Target friend
            var targetFriendship = new Friendship(probableFriend, userIdentifier, user.UserName,
                user.ProfilePictureId, FriendshipState.Accepted);

            if (await _friendshipManager.GetFriendshipOrNullAsync(probableFriend, userIdentifier) == null)
            {
                await _friendshipManager.CreateFriendshipAsync(targetFriendship);

                var clients = await _onlineClientManager.GetAllByUserIdAsync(probableFriend);
                if (clients.Any())
                {
                    var isFriendOnline = await _onlineClientManager.IsOnlineAsync(sourceFriendship.ToUserIdentifier());
                    await _chatCommunicator.SendFriendshipRequestToClient(clients, targetFriendship, false,
                        isFriendOnline);
                }
            }

            var senderClients = await _onlineClientManager.GetAllByUserIdAsync(userIdentifier);
            if (senderClients.Any())
            {
                var isFriendOnline = await _onlineClientManager.IsOnlineAsync(targetFriendship.ToUserIdentifier());
                await _chatCommunicator.SendFriendshipRequestToClient(senderClients, sourceFriendship, true,
                    isFriendOnline);
            }

            var sourceFriendshipRequest = ObjectMapper.Map<FriendDto>(sourceFriendship);
            sourceFriendshipRequest.IsOnline = (await _onlineClientManager.GetAllByUserIdAsync(probableFriend)).Any();

            return sourceFriendshipRequest;
        }

        public async Task<FriendDto> CreateFriendshipWithDifferentTenant(CreateFriendshipWithDifferentTenantInput input)
        {
            var probableFriend = await GetUserIdentifier(input.TenancyName, input.UserName);
            return await CreateFriendshipRequest(new CreateFriendshipRequestInput
            {
                TenantId = probableFriend.TenantId,
                UserId = probableFriend.UserId
            });
        }

        public async Task<FriendDto> CreateFriendshipForCurrentTenant(CreateFriendshipForCurrentTenantInput input)
        {
            var user = await UserManager.FindByNameOrEmailAsync(input.UserName);
            if (user == null)
            {
                throw new UserFriendlyException(L("ThereIsNoUserRegisteredWithNameOrEmail{0}", input.UserName));
            }

            var probableFriend = user.ToUserIdentifier();

            return await CreateFriendshipRequest(new CreateFriendshipRequestInput
            {
                TenantId = null, // Multi-tenancy removed
                UserId = probableFriend.UserId
            });
        }

        public async Task BlockUser(BlockUserInput input)
        {
            var userIdentifier = AbpSession.ToUserIdentifier();
            var friendIdentifier = new UserIdentifier(input.TenantId, input.UserId);
            await _friendshipManager.BanFriendAsync(userIdentifier, friendIdentifier);

            var clients = await _onlineClientManager.GetAllByUserIdAsync(userIdentifier);
            if (clients.Any())
            {
                await _chatCommunicator.SendUserStateChangeToClients(clients, friendIdentifier,
                    FriendshipState.Blocked);
            }
        }

        public async Task UnblockUser(UnblockUserInput input)
        {
            var userIdentifier = AbpSession.ToUserIdentifier();
            var friendIdentifier = new UserIdentifier(input.TenantId, input.UserId);
            await _friendshipManager.AcceptFriendshipRequestAsync(userIdentifier, friendIdentifier);

            var clients = await _onlineClientManager.GetAllByUserIdAsync(userIdentifier);
            if (clients.Any())
            {
                await _chatCommunicator.SendUserStateChangeToClients(clients, friendIdentifier,
                    FriendshipState.Accepted);
            }
        }

        public async Task AcceptFriendshipRequest(AcceptFriendshipRequestInput input)
        {
            var userIdentifier = AbpSession.ToUserIdentifier();
            var friendIdentifier = new UserIdentifier(input.TenantId, input.UserId);
            await _friendshipManager.AcceptFriendshipRequestAsync(userIdentifier, friendIdentifier);

            var clients = await _onlineClientManager.GetAllByUserIdAsync(userIdentifier);
            if (clients.Any())
            {
                await _chatCommunicator.SendUserStateChangeToClients(clients, friendIdentifier,
                    FriendshipState.Blocked);
            }
        }

        private async Task<UserIdentifier> GetUserIdentifier(string tenancyName, string userName)
        {
            // Multi-tenancy removed - tenancyName parameter ignored
            var user = await UserManager.FindByNameOrEmailAsync(userName);
            if (user == null)
            {
                throw new UserFriendlyException(L("ThereIsNoUserRegisteredWithNameOrEmail{0}", userName));
            }

            return user.ToUserIdentifier();
        }
        
        public async Task RemoveFriend(RemoveFriendInput input)
        {
            var userIdentifier = AbpSession.ToUserIdentifier();
            var friendIdentifier = new UserIdentifier(input.TenantId, input.UserId);
            await _friendshipManager.RemoveFriendAsync(userIdentifier, friendIdentifier);
        }
    }
}