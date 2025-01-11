const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all available commands and their descriptions'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Help - List of Commands')
            .setDescription('Here are all the commands you can use with this bot:')
            .addFields(
                { name: '/setchannel', value: 'Sets the channel for the bot\'s messages.' },
                { name: '/instructions', value: 'Shows how to set up the bot.' },
            );

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
