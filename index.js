const { Client, GatewayIntentBits, Collection } = require('discord.js');
const config = require('./config');
const bot = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent]
});
const crypto = require('crypto');
const fs = require('fs');
const connectDB = require('./src/handlers/mongo');
const mongoose = require('mongoose');
connectDB();
bot.applicationSessions = {};
bot.commands = new Collection();

const eventhandler = require('./src/handlers/eventhandler');
const commandHandler = require('./src/handlers/commandhandler'); 

eventhandler(bot);
(async () => {
    await commandHandler.deploySlashCommands(); 
})();

bot.login(config.token);