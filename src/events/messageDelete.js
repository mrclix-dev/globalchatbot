const { WebhookClient } = require('discord.js');
const Channel = require('../models/channel'); 
const messageCache = require('../maps/messageCache.js');
// this should delete webhook depending on the orginal message that have been deleted!
// it doesnt work 1bit
// erm i forgot to make it ignore if webhooks that got deleted
module.exports = {
    name: 'messageDelete',
    async execute(message) {
     
    },
};
