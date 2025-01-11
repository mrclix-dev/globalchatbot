const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Submit your feedback'),

    async execute(interaction) {
        // Create the feedback modal
        const modal = new ModalBuilder()
            .setCustomId('feedbackModal')
            .setTitle('Feedback Form');

        // Create a text input for the feedback
        const feedbackInput = new TextInputBuilder()
            .setCustomId('feedbackInput')
            .setLabel('Enter your feedback:')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Your feedback here...');

        const firstActionRow = new ActionRowBuilder().addComponents(feedbackInput);

        modal.addComponents(firstActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};
