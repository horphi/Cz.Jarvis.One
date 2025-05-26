using System.Collections.Generic;

namespace Cz.Jarvis.EntityChanges.Dto
{
    public class EntityAndPropertyChangeListDto
    {
        public EntityChangeListDto EntityChange { get; set; }
        public List<EntityPropertyChangeDto> EntityPropertyChanges { get; set; }
    }
}
