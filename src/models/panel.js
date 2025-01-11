const mongoose = require('mongoose');

const panelSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: true }
});

const Panel = mongoose.model('Panel', panelSchema);

module.exports = Panel;