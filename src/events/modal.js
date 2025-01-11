const { readdirSync, readFile, writeFile } = require('fs');
const { join } = require('path');
const {ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require('discord.js');
const jsonfl = require('../models/h.json')
module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
       if (interaction.customId === 'btn') {
        const modal = new ModalBuilder()
        .setCustomId('modal')
        .setTitle('hello')

        const test1 = new TextInputBuilder()
        .setCustomId('test1')
        .setLabel('hello')
        .setStyle(TextInputStyle.Short);

        const action1 = new ActionRowBuilder().addComponents(test1);

        modal.addComponents(action1)

        await interaction.showModal(modal)
       }


       if (interaction.customId === 'modal') {
        const text11 = interaction.fields.getTextInputValue("test1");
         const newdata = {"hi":`${text11}`};

         readFile('./src/models/h.json','utf8', (err, data) => {
            if (err) {
                interaction.reply(`${err}`);
                return;
            }

            let json;
            try {
                json = JSON.parse(data);

            } catch(errr) {
                console.log(`${errr}`);
                return;
            }

            json.push(newdata);
            writeFile('./src/models/h.json', JSON.stringify(json, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error("Error writing to the file:", writeErr);
                } else {
                    console.log("JSON data updated successfully.");
                }
            });
        });
       }
    },
};
