const { SlashCommandBuilder  } = require('discord.js');
const Channel = require('../../models/channel');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
      
    },
};
