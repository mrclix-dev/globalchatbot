const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const Panel = require('../models/panel'); // Adjust the path to your Mongoose model
const config = require('../../config.json');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'server_select') {
                if (!config.alloweduserids.includes(interaction.user.id)) {
                    return interaction.reply({ content: 'You do not have permission to use this interaction.', ephemeral: true });
                }

                const selectedValue = interaction.values[0];

                if (selectedValue === 'list_servers') {
                                      // Create an array of promises to fetch member counts
                                      const serverInfoPromises = interaction.client.guilds.cache.map(async guild => {
                                        const memberCount = guild.memberCount || 'Unknown'; // Fallback if memberCount is not available
                                        return `${guild.name} (ID: ${guild.id}) - Members: ${memberCount}`;
                                    });
                
                                    // Wait for all promises to resolve
                                    const serverInfo = await Promise.all(serverInfoPromises);
                                    const serverList = serverInfo.join('\n');
                
                                    await interaction.reply({ content: `Here are the servers the bot is in:\n${serverList}`, ephemeral: true });
                } else if (selectedValue === 'leave_server') {
                    const modal = new ModalBuilder()
                        .setCustomId('leaveServerModal')
                        .setTitle('Leave Server');

                    const serverIdInput = new TextInputBuilder()
                        .setCustomId('serverIdInput')
                        .setLabel('Enter the Server ID to leave:')
                        .setStyle(TextInputStyle.Short);

                    const firstActionRow = new ActionRowBuilder().addComponents(serverIdInput);

                    modal.addComponents(firstActionRow);

                    await interaction.showModal(modal);
                } else if (selectedValue === 'request_invite') {
                    const modal = new ModalBuilder()
                        .setCustomId('requestInviteModal')
                        .setTitle('Request Server Invite');

                    const serverIdInput = new TextInputBuilder()
                        .setCustomId('serverIdInput')
                        .setLabel('Enter the Server ID to request an invite:')
                        .setStyle(TextInputStyle.Short);

                    const firstActionRow = new ActionRowBuilder().addComponents(serverIdInput);

                    modal.addComponents(firstActionRow);

                    await interaction.showModal(modal);
                }
            }
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'leaveServerModal') {
                await interaction.deferReply({ ephemeral: true });

                const serverId = interaction.fields.getTextInputValue('serverIdInput');
                const guild = interaction.client.guilds.cache.get(serverId);

                if (guild) {
                    await guild.leave();
                    await interaction.editReply({ content: `Successfully left the server: ${guild.name} (ID: ${serverId})` });
                } else {
                    await interaction.editReply({ content: `Could not find a server with ID: ${serverId}` });
                }
            } else if (interaction.customId === 'requestInviteModal') {
                await interaction.deferReply({ ephemeral: true });

                const serverId = interaction.fields.getTextInputValue('serverIdInput');
                const guild = interaction.client.guilds.cache.get(serverId);

                if (guild) {
                    try {
                        const owner = await interaction.client.users.fetch(guild.ownerId);
                        await owner.send(`The user ${interaction.user.tag} (${interaction.user.id}) has requested a server invite. Please contact them at ${interaction.user.tag} to discuss the invitation and why they want to join.`);
                        await interaction.editReply({ content: 'The server owner has been notified of your request.', ephemeral: true });
                    } catch (error) {
                        console.error('Error sending DM to the server owner:', error);
                        await interaction.editReply({ content: 'There was an error sending your request to the server owner. Please try again later.', ephemeral: true });
                    }
                } else {
                    await interaction.editReply({ content: `Could not find a server with ID: ${serverId}`, ephemeral: true });
                }
            }
        }
    },
};