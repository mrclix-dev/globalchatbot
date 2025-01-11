const Channel = require('../models/channel');
const Panel = require('../models/panel');

module.exports = {
    name: "guildDelete",
    async execute(guild) {
        try {
            // Remove the server's data from the Channel collection
            await Channel.deleteMany({ guildId: guild.id });


            console.log(`Data for guild ${guild.id} removed from database.`);
        } catch (error) {
            console.error(`Error removing data for guild ${guild.id}:`, error);
        }
    }
};
