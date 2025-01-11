const { readdirSync } = require('fs');
const { join, relative } = require('path');
const chalk = require('chalk');

module.exports = (bot) => {
    console.log(chalk.blue('[info]') + ' Loading events...');

    const eventFiles = readdirSync(join(__dirname, '..', 'events')).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = join(__dirname, '..', 'events', file);
        try {
            const event = require(filePath);

            if (!event.name || typeof event.execute !== 'function') {
                throw new Error('Invalid event file: missing "name" or "execute" function');
            }

            if (event.once) {
                bot.once(event.name, (...args) => event.execute(...args, bot));
            } else {
                bot.on(event.name, (...args) => event.execute(...args, bot));
            }

            console.log(`${chalk.blue('[info]')} Loaded event: ${event.name} from ${relative(process.cwd(), filePath)}`);
        } catch (error) {
            console.error(`${chalk.blue('[info]')} ${chalk.red('Failed to load event from')} ${relative(process.cwd(), filePath)}`);
        }
    }

    console.log(chalk.blue('[info]') + ' Finished loading events.');
};
