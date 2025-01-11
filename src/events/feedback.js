const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'feedbackModal') {
                await interaction.deferReply({ ephemeral: true });

                const feedback = interaction.fields.getTextInputValue('feedbackInput');

                // Fetch the channel by ID from config
                const feedbackChannel = interaction.client.channels.cache.get('1260231255962812437');

                if (feedbackChannel) {
                    // Create the embed message
                    const embed = new EmbedBuilder()
                        .setColor(0x0099ff)
                        .setTitle('New Feedback Received')
                        .setDescription(feedback)
                        .setFooter({ text: `Submitted by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                        .setTimestamp();

                    // Send the embed to the feedback channel
                    await feedbackChannel.send({ embeds: [embed] });

                    await interaction.editReply({ content: 'Thank you for your feedback!', ephemeral: true });
                } else {
                    await interaction.editReply({ content: 'The feedback channel could not be found. Please contact an admin.', ephemeral: true });
                }
            }
        }
    },
};
