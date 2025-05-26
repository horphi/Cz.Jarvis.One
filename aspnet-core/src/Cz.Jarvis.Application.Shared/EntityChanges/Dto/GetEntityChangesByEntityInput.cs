using Cz.Jarvis.Dto;
using System;

namespace Cz.Jarvis.EntityChanges.Dto
{
    public class GetEntityChangesByEntityInput
    {
        public string EntityTypeFullName { get; set; }
        public string EntityId { get; set; }
    }
}
