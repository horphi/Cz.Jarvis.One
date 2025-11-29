using System;
using System.Reflection;
using Abp.Extensions;

namespace Abp
{
    /// <summary>
    /// Used to identify a user.
    /// </summary>
    [Serializable]
    public class UserIdentifier : IUserIdentifier
    {
        /// <summary>
        /// Tenant Id of the user.
        /// Multi-tenancy removed - always null.
        /// </summary>
        public int? TenantId { get; protected set; }

        /// <summary>
        /// Id of the user.
        /// </summary>
        public long UserId { get; protected set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="UserIdentifier"/> class.
        /// </summary>
        protected UserIdentifier()
        {

        }

        /// <summary>
        /// Initializes a new instance of the <see cref="UserIdentifier"/> class.
        /// </summary>
        /// <param name="tenantId">Tenant Id of the user (ignored - multi-tenancy removed).</param>
        /// <param name="userId">Id of the user.</param>
        public UserIdentifier(int? tenantId, long userId)
        {
            TenantId = null; // Multi-tenancy removed - always null
            UserId = userId;
        }

        /// <summary>
        /// Parses given string and creates a new <see cref="UserIdentifier"/> object.
        /// </summary>
        /// <param name="userIdentifierString">
        /// Should be formatted as: "userId". Ex: "42"
        /// Legacy format "userId@tenantId" is supported but tenantId is ignored.
        /// </param>
        public static UserIdentifier Parse(string userIdentifierString)
        {
            if (userIdentifierString.IsNullOrEmpty())
            {
                throw new ArgumentNullException(nameof(userIdentifierString), "userIdentifierString can not be null or empty!");
            }

            var splitted = userIdentifierString.Split('@');
            // Always parse just the userId (first part), ignore tenant if present
            return new UserIdentifier(null, splitted[0].To<long>());
        }

        /// <summary>
        /// Creates a string represents this <see cref="UserIdentifier"/> instance.
        /// Formatted as: "userId". Ex: "42"
        ///
        /// Returning string can be used in <see cref="Parse"/> method to re-create identical <see cref="UserIdentifier"/> object.
        /// </summary>
        public string ToUserIdentifierString()
        {
            return UserId.ToString();
        }

        public override bool Equals(object obj)
        {
            if (obj == null || !(obj is UserIdentifier))
            {
                return false;
            }

            //Same instances must be considered as equal
            if (ReferenceEquals(this, obj))
            {
                return true;
            }

            //Transient objects are not considered as equal
            var other = (UserIdentifier)obj;

            //Must have a IS-A relation of types or must be same type
            var typeOfThis = GetType();
            var typeOfOther = other.GetType();
            if (!typeOfThis.GetTypeInfo().IsAssignableFrom(typeOfOther) && !typeOfOther.GetTypeInfo().IsAssignableFrom(typeOfThis))
            {
                return false;
            }

            return UserId == other.UserId; // Multi-tenancy removed - only compare UserId
        }

        /// <inheritdoc/>
        public override int GetHashCode()
        {
            return UserId.GetHashCode(); // Multi-tenancy removed - only use UserId
        }

        /// <inheritdoc/>
        public static bool operator ==(UserIdentifier left, UserIdentifier right)
        {
            if (Equals(left, null))
            {
                return Equals(right, null);
            }

            return left.Equals(right);
        }

        /// <inheritdoc/>
        public static bool operator !=(UserIdentifier left, UserIdentifier right)
        {
            return !(left == right);
        }

        public override string ToString()
        {
            return ToUserIdentifierString();
        }
    }
}
