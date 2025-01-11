const { PresenceUpdateStatus, ActivityType, EmbedBuilder } = require('discord.js');
const Panel = require('../models/panel');
const Channel = require('../models/channel');

module.exports = {
    name: 'ready',
    once: true,
    async execute(bot) {
      console.log(`Logged in as ${bot.user?.tag}`)
      bot.user.setPresence({ activities: [{ name:'Nothing', type: 0 }], status: 'idle' });

      setInterval(async () => {
          try {
              // Fetch all panels from the database
              const panels = await Panel.find({});

              for (const panel of panels) {
                  const channel = await bot.channels.fetch(panel.channelId);

                  if (!channel || !channel.isTextBased()) continue;

                  const messages = await channel.messages.fetch();
                  const panelMessage = messages.find(msg => msg.embeds.length > 0 && msg.embeds[0].title === 'Server Management Panel');

                  if (!panelMessage) continue;

                  // Fetch the number of servers the bot is in
                  const totalServers = bot.guilds.cache.size;

                  // Fetch the number of servers with the bot set up
                  const setupedservers = await Channel.countDocuments({});

                  // Create the embed message
                  const embed = new EmbedBuilder()
                      .setColor(0x0099ff)
                      .setTitle('Server Management Panel')
                      .setDescription('Select an option from the menu below:')
                      .addFields(
                          { name: 'Total Servers', value: `${totalServers}`, inline: true },
                          { name: 'Servers that set up the bot', value: `${setupedservers}`, inline: true }
                      )
                      .setTimestamp();

                  // Update the panel message
                  await panelMessage.edit({ embeds: [embed] });
              }
          } catch (error) {
              console.error('Error updating panel messages:', error);
          }
      }, 40000); // 40 seconds interval
  }
};
