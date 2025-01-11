const { SlashCommandBuilder, WebhookClient } = require('discord.js');
const Channel = require('../../models/channel'); // Path to your Mongoose model

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setchannel')
        .setDescription('Set the channel for cross-server chat')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to use for cross-server chat')
                .setRequired(true)),
    async execute(interaction) {
        try {
            await interaction.deferReply(); // Defer the reply if needed

            const channel = interaction.options.getChannel('channel');

            // Check if a webhook already exists for this channel
            const existingChannel = await Channel.findOne({ channelId: channel.id });
            if (existingChannel) {
                await interaction.editReply(`A webhook already exists for ${channel.name}.`);
                return;
            }

            // Create a new webhook
            const webhook = await channel.createWebhook({
                name: 'CrossChatWebhook',
                avatar: 'https://i.imgur.com/AfFp7pu.png',
            })
            // Save the webhook URL, channel ID, and guild ID to the database
            await Channel.create({
                guildId: channel.guild.id,
                channelId: channel.id,
                webhookUrl: `https://discord.com/api/webhooks/${webhook.id}/${webhook.token}` // Save the complete webhook URL
            });

            await interaction.editReply(`Channel ${channel.name} set for cross-server chat with webhook URL ${webhook.url}.
            dont forget to give a feedback
            `);
        } catch (error) {
            console.error('Error executing command:', error);
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ content: 'There was an error while executing this command.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
            }
        }
    },
};
