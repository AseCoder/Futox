module.exports = {
	name: 'bug',
	usage: '',
  description: 'Instructions on how to report a bug',
  category: 'info',
  async execute(msg, args, client, Discord) {
    const embed = new Discord.RichEmbed()
      .setTitle(`Found a bug with ${client.user.username}?`)
      .setDescription(`Try one of these:`)
      .addField('**a)** DM one of the core developers:', client.global.core_devs.map(x => x.tag).join('\n'))
      .addField('**b)** Join the', `[support server.](https://discord.gg/rvHuJtB 'https://discord.gg/rvHuJtB')`)
      .addField('**c)** Open an issue on the', `[GitHub repository.](https://github.com/AseCoder/Futox/issues 'https://github.com/AseCoder/Futox/issues')`)
      .setColor(client.colors.botGold);
    msg.channel.send(embed);
  },
};