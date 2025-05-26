using Abp.EntityHistory;
using Cz.Jarvis.Authorization.Users;
using System.Collections.Generic;

namespace Cz.Jarvis.EntityChanges
{
    public class EntityChangePropertyAndUser
    {
        public EntityChange EntityChange { get; set; }
        public List<EntityPropertyChange> PropertyChanges { get; set; }
        public User User { get; set; }
    }
}
