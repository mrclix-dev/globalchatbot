const { WebhookClient } = require('discord.js');
const Channel = require('./models/Channel'); // Path to your Mongoose model

async function createWebhook(channel) {
    const webhook = await channel.createWebhook('Webhook Name', {
        avatar: 'https://i.imgur.com/AfFp7pu.png', // Optional: Set a default avatar
    });

    // Save the webhook URL, channel ID, and guild ID to the database
    await Channel.create({
        guildId: channel.guild.id,
        channelId: channel.id,
        webhookUrl: `https://discord.com/api/webhooks/${webhook.id}/${webhook.token}` // Save the complete webhook URL
    });

    return webhook;
}
