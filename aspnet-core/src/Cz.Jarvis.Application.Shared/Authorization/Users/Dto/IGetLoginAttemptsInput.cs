using Abp.Application.Services.Dto;

namespace Cz.Jarvis.Authorization.Users.Dto
{
    public interface IGetLoginAttemptsInput: ISortedResultRequest
    {
        string Filter { get; set; }
    }
}