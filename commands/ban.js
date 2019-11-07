module.exports = {
  name: 'ban',
  usage: '[User] [reason]',
  description: 'Ban a user from this guild',
  category: 'punishing',
  async execute(msg, args, client, Discord) {
    if (!msg.guild.me.hasPermission('BAN_MEMBERS', true, true)) return msg.channel.send('Missing permission: Ban members!');
    if (!args[1]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0]);
    const member = client.funcs.fetchMember(args[0], msg);
    if (!member) return msg.channel.send(client.global.replies.noMember);
    if (member.user.id === client.user.id) return msg.channel.send('I can\'t ban myself!');
    const canPunish = client.funcs.canPunish({
      client,
      guildId: msg.guild.id,
      punishmentType: 'BAN',
      punisherMember: msg.member,
      punishedMember: member,
    });
    if (!canPunish.result) return msg.channel.send(canPunish.errorMessage);
    const embed = new Discord.RichEmbed()
      .setTitle(`Are you sure you want to ban ${member.displayName}?`)
      .setDescription(`Tag: ${member.user.tag}\nNickname: ${member.nickname ? member.nickname : 'None'}\nID: ${member.user.id}`)
      .setThumbnail(member.user.displayAvatarURL) 
      .setFooter('Respond with "Y" for yes, "N" for no.')
      .setColor(client.colors.botGold)
    await msg.channel.send(embed);
    const messages = await msg.channel.awaitMessages(m => m.author.id === msg.author.id, {
      maxMatches: 1,
      time: 600000,
      errors: ['time']
    });
    if (messages.size < 1 || messages.first().content.toUpperCase() !== 'Y') {
      return msg.channel.send('Cancelling ban.');
    }
    let reason = args.slice(1).join(' ');
    await msg.guild.member(member.user).ban(reason);
    const d = client.global.db.guilds[msg.guild.id];
    if (d.channels.punishments) {
      const embed = new Discord.RichEmbed()
        .setTitle('**- Ban -**')
        .addField('Banned User', member)
        .addField('Banned By', msg.member)
        .addField('Banned For', reason)
        .setColor('#ff0000')
      await msg.guild.channels.get(d.channels.punishments).send(embed);
    }
    msg.channel.send(`Successfully banned **${member.displayName}**.`);
  },
};