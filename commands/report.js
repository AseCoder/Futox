module.exports = {
	name: 'report',
	usage: '[User]',
  description: 'Report a user',
  category: 'utility',
  async execute(msg, args, client, Discord) {
    if (!args[0]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0], client);
    const d = client.global.db.guilds[msg.guild.id];
    if (!d.channels.reports) return msg.channel.send('This server has no `reports` channel. I can not report them.');
    const member = client.funcs.fetchMember(args.join(' '), msg);
    const embed = new Discord.RichEmbed()
      .setTitle(`User report from ${msg.member.toString()} in ${msg.channel.toString()}:`)
      .setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL)
      .addField(`Reported user:`, `"${args.join(' ')}"${member ? `\nDiscord user found: ${member}` : '\nNo Discord user found.'}`)
      .setColor(client.colors.botGold);
    msg.channel.send('What is the reason you are reporting this user? What did they do wrong? How should they have behaved? What do you think is an approperiate punishment for this user? Please answer with 1 message.');
    const filter = x => x.author.id === msg.author.id;
    const collected = await msg.channel.awaitMessages(filter, { maxMatches: 1, time: 600000, errors: ['time'] })
    embed.addField('Additional information:', collected.size > 0 ? ('"' + collected.first().content + '"') : 'No additional information.');
    if (d.roles.moderator) await msg.guild.channels.get(d.channels.reports).send(`<&${d.roles.moderator}>`);
    await msg.guild.channels.get(d.channels.reports).send(embed);
    msg.channel.send('Thank you for reporting this user. I have sent this information forward to representative staff members.');
  },
};