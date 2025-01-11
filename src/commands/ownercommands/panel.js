const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder } = require('discord.js');
const Panel = require('../../models/panel'); 
const config = require('../../../config.json');
const Channel = require('../../models/channel');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setpanelup')
        .setDescription('Owner only command')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('Channel to set the panel up in')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (!config.alloweduserids.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You are not authorized to use the panel', ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');
        const selectmenu = new StringSelectMenuBuilder()
            .setCustomId('server_select')
            .setPlaceholder('Admin Panel')
            .addOptions([
                new StringSelectMenuOptionBuilder()
                    .setLabel('List all servers')
                    .setDescription('Shows all servers the bot is in.')
                    .setValue('list_servers'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Leave a server')
                    .setDescription('Makes the bot leave a server.')
                    .setValue('leave_server'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Request Server Invite')
                    .setDescription('Asks the owner for a server invite.')
                    .setValue('request_invite'),
            ]);

        const actionrow = new ActionRowBuilder().addComponents(selectmenu);

        // Fetch the number of servers the bot is in
        const totalServers = interaction.client.guilds.cache.size;

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
            )
            .setTimestamp();

        // Save the panel setup to the database
        await Panel.updateOne(
            { guildId: interaction.guild.id },
            { guildId: interaction.guild.id, channelId: channel.id },
            { upsert: true }
        );

        await channel.send({ embeds: [embed], components: [actionrow] });

        return interaction.reply({ content: 'Panel set up successfully!', ephemeral: true });
    }
};
