let futox;
const Discord = require('discord.js');
module.exports = async function (channel, commandName) {
  if (!commandName && channel.user !== undefined) {
    futox = channel;
  } else {
    const prefix = futox.global.db.guilds[channel.guild.id].prefix;
    let prefixLength = 0;
    if (commandName.startsWith(prefix)) prefixLength = prefix.length;
    const command = futox.commands.get(commandName.slice(prefixLength));
    const embed = new Discord.RichEmbed()
      .setTitle(`Incorrect usage! Correct usage: \`!${command.name} ${command.usage}\``)
      .setColor(futox.colors.botGold);
    return channel.send(embed);
  }
};
