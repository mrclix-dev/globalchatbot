const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    webhookUrl: { type: String, required: true }
});

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
