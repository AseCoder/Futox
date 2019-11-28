module.exports = {
  name: 'unmute',
  usage: '[User]',
  description: 'Unmute someone',
  category: 'moderation',
  async execute(msg, args, client, Discord) {
    if (!args[0]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0], client);
    const member = client.funcs.fetchMember(args[0], msg);
    if (!member) return msg.channel.send(client.global.replies.noMember);
    if (member.user.id === client.user.id) return msg.channel.send('I can\'t unmute myself!');
    const canPunish = client.funcs.canPunish({
      client,
      guildId: msg.guild.id,
      punishmentType: 'MUTE',
      punisherMember: msg.member,
      punishedMember: member,
    });
    if (!canPunish.result) return msg.channel.send(canPunish.errorMessage);
    const d = client.global.db.guilds[msg.guild.id];
    if (!d.mutes.map(x => x.id).includes(member.user.id)) return msg.channel.send('They aren\'t even muted.');
    const muteindex = d.mutes.map(x => x.id).indexOf(member.user.id);
    if (d.mutes[muteindex].embedId && d.mutes[muteindex].embedChannelId) {
      client.channels.get(d.mutes[muteindex].embedChannelId).fetchMessage(d.mutes[muteindex].embedId).then(message => {
        const embed = new Discord.RichEmbed(message.embeds[0])
          .setColor(0)
          .setTitle('Temporary mute **UNMUTED**')
        message.edit(embed);
      });
    } 
    client.global.db.guilds[msg.guild.id].mutes.splice(muteindex, 1);
    msg.channel.send(`${member.user.tag} has been unmuted.`);
  },
};