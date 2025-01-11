const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('instructions')
        .setDescription('Shows how to set up the bot'),
    async execute(interaction) {
        const button = new ButtonBuilder()
            .setLabel('Join our Discord server')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.gg/5WkkhHn4rK'); // Correct URL without customId

        const actionRow = new ActionRowBuilder().addComponents(button);

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Bot Setup Instructions')
            .setDescription('Follow these steps to set up the bot in your server:')
            .addFields(
                { name: 'Step 1', value: 'Use the `/setchannel` command to set the channel for the bot\'s messages. Example: `/setchannel channel:#your-channel`' },
                { name: 'Step 2', value: 'Make sure you have the necessary permissions to set up and manage the bot.' },
                { name: 'Step 3', value: 'Use the panel options to manage the bot\'s presence in your server.' }
            )
            .setFooter({ text: 'If you need further assistance, join our discord server link below!' });

        await interaction.reply({ embeds: [embed], components: [actionRow], ephemeral: true });
    }
};
