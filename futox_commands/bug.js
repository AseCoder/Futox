module.exports = {
	name: 'bug',
	usage: '',
  description: 'Instructions on how to report a bug',
  category: 'info',
  async execute(msg, args, client, Discord) {
    let embed = new Discord.RichEmbed()
      .setTitle(`Found a bug with ${client.user.username}?\nDM one of the core developers:`)
      .setDescription(`${client.global.core_devs.map(x => x.tag).join('\n')}\n\nOr join the support server: https://discord.gg/rvHuJtB`)
      .setColor(client.colors.botGold);
    msg.channel.send(embed);
  },
};