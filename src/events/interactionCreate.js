const { readdirSync } = require('fs');
const { join } = require('path');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        const { commandName } = interaction;

        try {
            const commandFolders = readdirSync(join(__dirname, '..', 'commands'));
            for (const folder of commandFolders) {
                const commandFiles = readdirSync(join(__dirname, '..', 'commands', folder)).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const command = require(join(__dirname, '..', 'commands', folder, file));
                    if (command && command.data && command.data.name === commandName && command.execute) {
                        await command.execute(interaction);
                        return;
                    }
                }
            }
            console.error(`Command ${commandName} does not exist or does not have an execute function.`);
        } catch (error) {
            console.error(`Error executing command ${commandName}:`, error);
            await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
        }
    },
};
