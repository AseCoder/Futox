module.exports = {
	name: 'help',
	usage: '[command]',
  description: 'Help with commands',
  category: 'info',
	async execute(msg, args, client, Discord) {
    if (args[0]) {
      if (!client.commands.has(args[0]) || (client.commands.has(args[0]) && client.commands.get(args[0]).omitFromHelp === true && msg.guild.id !== '489083836240494593')) return msg.channel.send('That command does not exist');
      const command = client.commands.get(args[0]);
      const embed = new Discord.RichEmbed()
        .setTitle(`${client.global.db.guilds[msg.guild.id].prefix}${command.name} ${command.usage}`)
        .setDescription(command.description)
      	.setFooter('[User] can be a user\'s username, nickname, mention or ID.')
        .setColor(client.colors.botGold)
      msg.channel.send(embed);
    } else {
      const categories = [];
      for (let i = 0; i < client.commands.size; i++) {
        if (!categories.includes(client.commands.array()[i].category)) categories.push(client.commands.array()[i].category);
      }
      let commands = '';
      for (let i = 0; i < categories.length; i++) {
        if (msg.guild.id === '489083836240494593') {
          commands += `**» ${categories[i].toUpperCase()}**\n${client.commands.filter(x => x.category === categories[i]).map(x => `\`${x.name}\``).join(', ')}\n`;
        } else {
          commands += `**» ${categories[i].toUpperCase()}**\n${client.commands.filter(x => x.category === categories[i] && !x.omitFromHelp).map(x => `\`${x.name}\``).join(', ')}\n`;
        }
      }
      const embed = new Discord.RichEmbed()
        .setTitle(`${client.user.username} help:`)
        .setDescription(commands)
        .setFooter(`"${client.global.db.guilds[msg.guild.id].prefix}help [command]" to see more information about a command. Any usage of these commands will be stored anonymously.`)
        .setColor(client.colors.botGold)
      msg.channel.send(embed);
    }
  },
};
