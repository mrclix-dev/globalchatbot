const { readdirSync, statSync } = require('fs');
const { join, relative } = require('path');
const { REST, Routes } = require('discord.js');
const { clientid, token } = require('../../config');
const chalk = require('chalk');

module.exports = {
    async deploySlashCommands() {
        console.log(' ')
        console.log(chalk.blue('[info]') + ' Loading commands...');

        const bot = new REST({ version: '10' }).setToken(token);
        const commandFiles = getAllCommandFiles(join(__dirname, '..', 'commands'));
        const commands = [];

        for (const file of commandFiles) {
            try {
                const command = require(file);
                if (!command.data) {
                    throw new Error('Invalid command file: missing "data" property');
                }

                // Validate command name using a regex pattern
                if (!/^[\p{Ll}\p{Lm}\p{Lo}\p{N}\p{sc=Devanagari}\p{sc=Thai}_-]+$/u.test(command.data.name)) {
                    throw new Error(`Invalid command name: "${command.data.name}"`);
                }

                commands.push(command.data.toJSON());
                console.log(`${chalk.blue('[info]')} Loaded command: ${command.data.name} from ${relative(process.cwd(), file)}`);
            } catch (error) {
                console.error(`${chalk.blue('[info]')} ${chalk.red('Failed to load command from')} ${relative(process.cwd(), file)}`);
            }
        }

        try {
            console.log(`${chalk.blue('[info]')} Started refreshing application (/) commands.`);
            await bot.put(Routes.applicationCommands(clientid), { body: commands });
            console.log(`${chalk.blue('[info]')} Successfully reloaded application (/) commands.`);
        } catch (error) {
            console.error(`${chalk.blue('[info]')} ${chalk.red('Failed to reload application (/) commands.')}`);
        }

        console.log(chalk.blue('[info]') + ' Finished loading commands.');
    }
};

function getAllCommandFiles(dir) {
    const commandFiles = [];
    const files = readdirSync(dir);
    for (const file of files) {
        const filePath = join(dir, file);
        const stat = statSync(filePath);
        if (stat.isDirectory()) {
            const nestedFiles = getAllCommandFiles(filePath);
            commandFiles.push(...nestedFiles);
        } else if (file.endsWith('.js')) {
            commandFiles.push(filePath);
        }
    }
    return commandFiles;
}
