module.exports = {
	name: 'guildinfo',
	usage: '[guild id]',
  description: 'See information about this Discord server, or if [guild id] was provided, get information about that guild.',
  category: 'info',
  async execute(msg, args, client, Discord) {
    let guild = msg.guild
    if (args[0] && client.guilds.get(args[0]) !== undefined) guild = client.guilds.get(args[0]);
    const embed = new Discord.RichEmbed()
      .setTitle('**- Guild Info -**')
      .setDescription(`Guild name: **${guild.name}**`)
      .setImage(guild.iconURL)
      .addField('Guild Owner:', `**${guild.owner}**`, true)
      .addField('Guild Creation Time:', `**${guild.createdAt}**`, true)
      .addField('Channels, Roles, Members', `**${guild.channels.filter(x => x.type !== 'category').size}** text & voice channels, **${guild.roles.size - 1}** roles and **${guild.memberCount}** members.`)
      .addField('Guild Region', `**${guild.region}**`, true)
      .addField('Guild Verified', `**${guild.verified}**`, true)
      .addField('Guild Verification Level', `**${guild.verificationLevel}**`, true)
      .addField('Guild Icon', `__${guild.iconURL}__`, true)
      .setColor(client.colors.botGold)
    msg.channel.send(embed);
  },
};