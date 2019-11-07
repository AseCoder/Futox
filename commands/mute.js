module.exports = {
	name: 'mute',
	usage: '[User] [time] [reason]',
  description: 'Temporarily mute a user',
  category: 'punishing',
  async execute(msg, args, client, Discord) {
    const d = client.global.db.guilds[msg.guild.id];
    if (!msg.member.hasPermission('MUTE_MEMBERS', true, true)) return msg.channel.send(client.global.replies.notAllowed);
    if (!args[1]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0], client);
    const member = client.funcs.fetchMember(args[0], msg);
    if (!member) return msg.channel.send(client.global.replies.noMember);
    //if (member.hasPermission('MUTE_MEMBERS', true, true)) return msg.channel.send('I can\'t mute them.');
    if (d.mutes.map(x => x.id).includes(member.user.id)) return msg.channel.send('That user is already muted. They can\'t have 2 mutes simultaneously.');
    const time = client.npm.ms(args[1]);
    if (isNaN(time)) return msg.channel.send('Incorrect time format, try one of the following: 10m, 5h, 1d');
    if (time > 31556926000) return msg.channel.send('You can only mute someone for 1 year.');
    client.global.db.guilds[msg.guild.id].mutes.push({
      id: member.user.id,
      timestamp: Date.now() + time,
    });
    let reason = args.slice(2).join(' ');
    msg.channel.send(`Muted **${member}** for **${client.npm.moment(time).from(0, true)}**`);
    if (!reason) {
      await msg.channel.send('[Optional] Reason for mute? (reply \'n\' for no reason)');
      await msg.channel.awaitMessages(m => m.author.id === msg.author.id, {
        max: 1,
        time: 60000,
        errors: ['time']
      }).catch(() => {
        msg.channel.send('No reason.');
        reason = null;
      }).finally(col => reason = col.first());
    }
    if (d.channels.punishments) {
      let embed = new Discord.RichEmbed()
        .setTitle('Temporary mute')
        .addField(`:small_orange_diamond: Muted Member`, member.toString())
        .addField(`:small_orange_diamond: Time Muted`, client.npm.moment(time).from(0, true) + ` (${time}ms)`)
        .addField(`:small_orange_diamond: Muted By`, msg.member.toString())
        .addField(`:small_orange_diamond: Reason`, reason ? reason : 'No reason specified.')
        .setColor(client.colors.botGold);
      const embedMessage = await client.channels.get(d.channels.punishments).send(embed).catch(err => {});
      embed
        .setTitle('Temporary mute **EXPIRED**')
        .setColor('#000000');
      setTimeout(async function () {
        client.funcs.removeMute(member.id, msg.guild.id, msg.channel.id, client);
        if (embedMessage && d.channels.punishments) embedMessage.edit(embed);
      }, time);
    } else {
      setTimeout(async function () {
        client.funcs.removeMute(member.id, msg.guild.id, msg.channel.id, client);
      }, time);
    }
  },
};