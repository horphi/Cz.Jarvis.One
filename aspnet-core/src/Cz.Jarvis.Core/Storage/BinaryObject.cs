using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp;
using Abp.Domain.Entities;

namespace Cz.Jarvis.Storage
{
    [Table("AppBinaryObjects")]
    public class BinaryObject : Entity<Guid>
    {
        public virtual string Description { get; set; }

        [Required]
        [MaxLength(BinaryObjectConsts.BytesMaxSize)]
        public virtual byte[] Bytes { get; set; }

        public BinaryObject()
        {
            Id = SequentialGuidGenerator.Instance.Create();
        }

        public BinaryObject(byte[] bytes, string description = null)
            : this()
        {
            Bytes = bytes;
            Description = description;
        }
    }
}
