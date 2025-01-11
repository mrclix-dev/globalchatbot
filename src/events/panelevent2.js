const { Client, EmbedBuilder } = require('discord.js');
const Channel = require('../models/channel');
const Panel = require('../models/panel');

module.exports = {
    name: "GuildCreate",
    async execute(guild) {
        // Fetch the panel setup from the database
        const panels = await Panel.find({});
        
        for (const panel of panels) {
            const channel = guild.channels.cache.get(panel.channelId);
            if (channel) {
                // Fetch the panel message
                const message = await channel.messages.fetch(panel.messageId);

                // Fetch the number of servers the bot is in
                const totalServers = guild.client.guilds.cache.size;

                // Fetch the number of servers with the bot set up
                const setupedservers = await Channel.countDocuments({});

                // Create the embed message
                const embed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle('Server Management Panel')
                    .setDescription('Select an option from the menu below:')
                    .addFields(
                        { name: 'Total Servers', value: `${totalServers}`, inline: true },
                        { name: 'Servers that set up the bot', value: `${setupedservers}`, inline: true }
                    );

                // Update the panel message
                await message.edit({ embeds: [embed] });
            }
        }
    }
};
