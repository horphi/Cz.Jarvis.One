using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp;
using Abp.Authorization.Users;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.ObjectMapping;
using Microsoft.EntityFrameworkCore;
using Cz.Jarvis.Chat;
using Cz.Jarvis.Chat.Dto;
using Cz.Jarvis.Chat.Exporting;
using Cz.Jarvis.Dto;
using Cz.Jarvis.EntityFrameworkCore;

namespace Cz.Jarvis.Gdpr
{
    public class ChatUserCollectedDataProvider : IUserCollectedDataProvider, ITransientDependency
    {
        private readonly IRepository<ChatMessage, long> _chatMessageRepository;
        private readonly IChatMessageListExcelExporter _chatMessageListExcelExporter;
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IRepository<UserAccount, long> _userAccountRepository;
        private readonly IObjectMapper _objectMapper;

        public ChatUserCollectedDataProvider(
            IRepository<ChatMessage, long> chatMessageRepository,
            IChatMessageListExcelExporter chatMessageListExcelExporter,
            IUnitOfWorkManager unitOfWorkManager,
            IRepository<UserAccount, long> userAccountRepository,
            IObjectMapper objectMapper)
        {
            _chatMessageRepository = chatMessageRepository;
            _chatMessageListExcelExporter = chatMessageListExcelExporter;
            _unitOfWorkManager = unitOfWorkManager;
            _userAccountRepository = userAccountRepository;
            _objectMapper = objectMapper;
        }

        public async Task<List<FileDto>> GetFiles(UserIdentifier user)
        {
            var conversations = await GetUserChatMessages(user.UserId);

            Dictionary<UserIdentifier, string> relatedUsernames;

            relatedUsernames = GetFriendUsernames(conversations.Select(c => c.Key).ToList());

            var chatMessageFiles = new List<FileDto>();

            foreach (var conversation in conversations)
            {
                foreach (var message in conversation.Value)
                {
                    message.TargetUserName = relatedUsernames[new UserIdentifier(null, message.TargetUserId)];
                }

                var messages = conversation.Value.OrderBy(m => m.CreationTime).ToList();
                chatMessageFiles.Add(_chatMessageListExcelExporter.ExportToFile(user, messages));
            }

            return chatMessageFiles;
        }

        private Dictionary<UserIdentifier, string> GetFriendUsernames(List<UserIdentifier> users)
        {
            var predicate = PredicateBuilder.New<UserAccount>();

            foreach (var user in users)
            {
                predicate = predicate.Or(ua => ua.UserId == user.UserId);
            }

            using (_unitOfWorkManager.Current.DisableFilter(AbpDataFilters.SoftDelete))
            {
                var userList = _userAccountRepository.GetAllList(predicate).Select(ua => new
                {
                    ua.UserId,
                    ua.UserName
                }).Distinct();

                return userList.ToDictionary(ua => new UserIdentifier(null, ua.UserId), ua => ua.UserName);
            }
        }

        private async Task<Dictionary<UserIdentifier, List<ChatMessageExportDto>>> GetUserChatMessages(long userId)
        {
            var conversations = (await _chatMessageRepository.GetAll()
                    .Where(message => message.UserId == userId)
                    .ToListAsync()
                )
                .GroupBy(message => new {message.TargetUserId})
                .Select(messageGrouped => new
                {
                    TargetUserId = messageGrouped.Key.TargetUserId,
                    Messages = messageGrouped
                }).ToList();

            return conversations.ToDictionary(c => new UserIdentifier(null, c.TargetUserId), c => _objectMapper.Map<List<ChatMessageExportDto>>(c.Messages));
        }
    }
}