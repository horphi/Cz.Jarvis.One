using Abp;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.UI;
using System;
using System.Threading.Tasks;

namespace Cz.Jarvis.Friendships
{
    public class FriendshipManager : JarvisDomainServiceBase, IFriendshipManager
    {
        private readonly IRepository<Friendship, long> _friendshipRepository;
        private readonly IUnitOfWorkManager _unitOfWorkManager;

        public FriendshipManager(
            IRepository<Friendship, long> friendshipRepository,
            IUnitOfWorkManager unitOfWorkManager)
        {
            _friendshipRepository = friendshipRepository;
            _unitOfWorkManager = unitOfWorkManager;
        }

        public async Task CreateFriendshipAsync(Friendship friendship)
        {
            await _unitOfWorkManager.WithUnitOfWorkAsync(async () =>
            {
                if (friendship.UserId == friendship.FriendUserId)
                {
                    throw new UserFriendlyException(L("YouCannotBeFriendWithYourself"));
                }

                await _friendshipRepository.InsertAsync(friendship);
                await CurrentUnitOfWork.SaveChangesAsync();
            });
        }

        public async Task UpdateFriendshipAsync(Friendship friendship)
        {
            await _unitOfWorkManager.WithUnitOfWorkAsync(async () =>
            {
                await _friendshipRepository.UpdateAsync(friendship);
                await CurrentUnitOfWork.SaveChangesAsync();
            });
        }

        public async Task<Friendship> GetFriendshipOrNullAsync(UserIdentifier user, UserIdentifier probableFriend)
        {
            return await _unitOfWorkManager.WithUnitOfWorkAsync(async () =>
            {
                return await _friendshipRepository.FirstOrDefaultAsync(friendship =>
                    friendship.UserId == user.UserId &&
                    friendship.FriendUserId == probableFriend.UserId);
            });
        }

        public async Task BanFriendAsync(UserIdentifier userIdentifier, UserIdentifier probableFriend)
        {
            await _unitOfWorkManager.WithUnitOfWorkAsync(async () =>
            {
                var friendship = (await GetFriendshipOrNullAsync(userIdentifier, probableFriend));
                if (friendship == null)
                {
                    throw new Exception("Friendship does not exist between " + userIdentifier + " and " + probableFriend);
                }

                friendship.State = FriendshipState.Blocked;
                await UpdateFriendshipAsync(friendship);
            });
        }

        public async Task RemoveFriendAsync(UserIdentifier userIdentifier, UserIdentifier probableFriend)
        {
            await _unitOfWorkManager.WithUnitOfWorkAsync(async () =>
            {
                var friendship = (await GetFriendshipOrNullAsync(userIdentifier, probableFriend));
                if (friendship == null)
                {
                    throw new Exception("Friendship does not exist between " + userIdentifier + " and " + probableFriend);
                }

                await _friendshipRepository.DeleteAsync(friendship);
            });
        }

        public async Task AcceptFriendshipRequestAsync(UserIdentifier userIdentifier, UserIdentifier probableFriend)
        {
            await _unitOfWorkManager.WithUnitOfWorkAsync(async () =>
            {
                var friendship = (await GetFriendshipOrNullAsync(userIdentifier, probableFriend));
                if (friendship == null)
                {
                    throw new Exception("Friendship does not exist between " + userIdentifier + " and " + probableFriend);
                }

                friendship.State = FriendshipState.Accepted;
                await UpdateFriendshipAsync(friendship);
            });
        }
    }
}
