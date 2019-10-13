module.exports = {
	name: 'verified',
	usage: '[User]',
  description: 'See if this user has approved the rules',
  category: 'moderation',
	async execute(msg, args, client, Discord) {
    if (!msg.member.hasPermission('MANAGE_MESSAGES', true, true)) return msg.channel.send('You are not allowed to do that!');
    const d = client.global.db.guilds[msg.guild.id];
    if (!d.channels.rules || !d.channels.swear_detection || !d.roles.verified) return msg.channel.send('This server is missing a `rules` channel, `swear_detection` channel or a `verified` role.');
    if (args[0]) {
      let member = client.funcs.fetchMember(args[0], msg);
      if (!member) return msg.channel.send('I could not obtain The User');
      if (member.roles.some(x => x.id === d.roles.verified)) {
        msg.channel.send(`:white_check_mark: **${member.displayName}** has approved the rules.`);
      } else {
        msg.channel.send(`:x: **${member.displayName}** has not approved the rules.`);
      }
    } else {
      const verifiedMembers = msg.guild.roles.get(d.roles.verified).members.filter(x => !x.user.bot);
      const unverifiedMembers = msg.guild.members.filter(x => !x.roles.has(d.roles.verified) && !x.user.bot);
      let cleanVerifiedMembers = verifiedMembers.map(x => x.user.tag).join(verifiedMembers.size > 5 ? ', ' : '\n');
      if (cleanVerifiedMembers.length > 1024) cleanVerifiedMembers = cleanVerifiedMembers.slice(0, 1021) + '...';
      let cleanUnverifiedMembers = unverifiedMembers.map(x => x.user.tag).join(unverifiedMembers.size > 5 ? ', ' : '\n');
      if (cleanUnverifiedMembers.length > 1024) cleanUnverifiedMembers = cleanUnverifiedMembers.slice(0, 1021) + '...';
      if (!cleanVerifiedMembers) cleanVerifiedMembers = '\u200b';
      if (!cleanUnverifiedMembers) cleanUnverifiedMembers = '\u200b';
      const mebed = new Discord.RichEmbed()
        .setTitle(`Verified people on **${msg.guild.name}**`)
        .addField(`**${verifiedMembers.size}** people who have approved the rules:`, cleanVerifiedMembers)
        .addField(`**${unverifiedMembers.size}** people who have not approved the rules :rage::`, cleanUnverifiedMembers)
        .addField('Rule approvement percentage:', (verifiedMembers.size / msg.guild.members.filter(x => !x.user.bot).size * 100).toFixed(2) + '%')
        .setColor(client.colors.botGold);
      msg.channel.send(mebed);
    }
  },
};