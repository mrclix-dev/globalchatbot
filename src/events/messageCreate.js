const { WebhookClient } = require('discord.js');
const Channel = require('../models/channel'); 
const messageCache = require('../maps/messageCache.js'); // Stores message information

const RATE_LIMIT = 5; // Max messages
const RATE_LIMIT_WINDOW = 30000; // 30 seconds = 30,000 milliseconds

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        // Ignore bot messages to prevent infinite loops
        if (message.author.bot) return;

        try {
            // Check if the message is from the specified channel
            const targetChannel = await Channel.findOne({ guildId: message.guild.id });
            if (!targetChannel || message.channel.id !== targetChannel.channelId) return;

            // Rate limit logic
            const now = Date.now();
            const userMessages = messageCache.get(message.author.id) || [];

            // Remove messages that are outside the rate limit window
            const recentMessages = userMessages.filter(({ timestamp }) => now - timestamp < RATE_LIMIT_WINDOW);
            messageCache.set(message.author.id, recentMessages);

            // Check if the rate limit is exceeded
            if (recentMessages.length >= RATE_LIMIT) {
                await message.react('⏰'); // React with ⏰ if rate-limited
                return; // Exit the function to prevent further processing
            }

            // Fetch all channels with stored webhooks
            const channels = await Channel.find({});

            // Get the server name
            const serverName = message.guild.name;

            // Loop through each channel record and forward messages
            for (const record of channels) {
                if (record.guildId !== message.guild.id) {
                    try {
                        const webhookClient = new WebhookClient({ url: record.webhookUrl });

                        // Prepare message content with server name and allowed mentions
                        const content = message.content;
                        const allowedMentions = { users: [] };

                        // Send the message through the webhook and get the sent message
                        const webhookMessage = await webhookClient.send({
                            content,
                            username: `${message.author.username} - ${serverName}`,
                            avatarURL: message.author.displayAvatarURL(),
                            allowedMentions
                        });

                        // Add the current message information to the cache, including the webhook message ID
                        recentMessages.push({
                            messageId: message.id,
                            authorId: message.author.id,
                            guildId: message.guild.id,
                            content: content,
                            timestamp: now,
                            webhookMessageId: webhookMessage.id,
                            webhookChannelId: webhookMessage.channel_id
                        });
                        messageCache.set(message.author.id, recentMessages);

                        // React to the original message with ✔
                        await message.react('✔');
                    } catch (error) {
                        console.error('Error sending message with webhook or reacting:', error);
                    }
                }
            }
        } catch (error) {
            console.error('Error handling messageCreate event:', error);
        }
    },
};
