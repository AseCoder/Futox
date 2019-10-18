module.exports = {
	name: 'guildinfo',
	usage: '[guild id]',
  description: 'See information about this Discord server, or if [guild id] was provided, get information about that guild.',
  category: 'info',
  async execute(msg, args, client, Discord) {
    let guild = msg.guild
    if (args[0] && client.guilds.get(args[0]) !== undefined) guild = client.guilds.get(args[0]);
    const owner = await guild.fetchMember(guild.ownerID);
    const embed = new Discord.RichEmbed()
      .setTitle(`${guild.name} Info`)
      .setDescription(`**${guild.channels.filter(x => x.type === 'text').size}** text channels\n**${guild.channels.filter(x => x.type === 'voice').size}** voice channels\n**${guild.roles.size}** roles\n**${guild.memberCount}** members`)
      .addField(`:small_orange_diamond: Created on`, client.npm.moment(guild.createdTimestamp).format('D.M.Y'))
      .addField(`:small_orange_diamond: Owned by`, owner.user.toString())
      .addField(`:small_orange_diamond: Icon`, guild.iconURL ? guild.iconURL : 'None')
      .setFooter('All dates are in EU format.')
      .setThumbnail(guild.iconURL)
      .setColor(client.colors.botGold)
    msg.channel.send(embed);
  },
};