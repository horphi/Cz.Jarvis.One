using System;
using Abp.Extensions;
using Abp.Localization;

namespace Abp.Webhooks
{
    public class WebhookDefinition
    {
        /// <summary>
        /// Unique name of the webhook.
        /// </summary>
        public string Name { get; }

        /// <summary>
        /// Display name of the webhook.
        /// Optional.
        /// </summary>
        public ILocalizableString DisplayName { get; set; }

        /// <summary>
        /// Description for the webhook.
        /// Optional.
        /// </summary>
        public ILocalizableString Description { get; set; }
        

        public WebhookDefinition(string name, ILocalizableString displayName = null, ILocalizableString description = null)
        {
            if (name.IsNullOrWhiteSpace())
            {
                throw new ArgumentNullException(nameof(name), $"{nameof(name)} can not be null, empty or whitespace!");
            }

            Name = name.Trim();
            DisplayName = displayName;
            Description = description;
        }
    }
}
