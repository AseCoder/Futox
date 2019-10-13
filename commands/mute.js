module.exports = {
	name: 'mute',
	usage: '[User] [time] [reason]',
  description: 'Temporarily mute a user',
  category: 'punishing',
  async execute(msg, args, client, Discord) {
    const d = client.global.db.guilds[msg.guild.id];
    if (!msg.member.hasPermission('MUTE_MEMBERS', true, true)) return msg.channel.send(client.global.replies.notAllowed);
    if (!args[2]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0], client);
    const member = client.funcs.fetchMember(args[0], msg);
    if (!member) return msg.channel.send(client.global.replies.noMember);
    if (member.hasPermission('MUTE_MEMBERS', true, true)) return msg.channel.send('I can\'t mute them.');
    if (d.mutes.map(x => x.id).includes(member.user.id)) return msg.channel.send('That user is already muted. They can\'t have 2 mutes simultaneously.');
    const time = client.npm.ms(args[1]);
    if (time > 31556926000) return msg.channel.send('You can only mute someone for 1 year.');
    let reason = ' because ' + args.slice(2).join(' ');
    let cleanTime = {};
    cleanTime['d'] = time / 86400000;
    cleanTime['h'] = time / 3600000;
    cleanTime['m'] = time / 60000;
    let cleanestTime;
    if (cleanTime.d < 1) {
      cleanestTime = `${Math.round((cleanTime.h + (cleanTime.m / 60)) * 10) / 10} hours`;
      if (cleanTime.h < 1) {
          cleanestTime = `${Math.round(cleanTime.m * 10) / 10} minutes`;
      } else {
          cleanestTime = `${Math.round((cleanTime.h + (cleanTime.m / 60)) * 10) / 10} hours`;
      }
    } else {
      cleanestTime = `${Math.round((cleanTime.d + (cleanTime.h / 24)) * 10) / 10} days`;
    }
    client.global.db.guilds[msg.guild.id].mutes.push({
      id: member.user.id,
      timestamp: Date.now() + time,
    });
    msg.channel.send(`Muted **${member}** for **${cleanestTime}**`);
    if (d.channels.punishments) {
      let embed = new Discord.RichEmbed()
        .setTitle('Temporary mute')
        .setDescription(`${member} was muted for ${cleanestTime} (${time}ms) by ${msg.member}${reason}.`)
        .setColor(client.colors.botGold);
      const embedMessage = await client.channels.get(d.channels.punishments).send(embed).catch(err => {});
      embed
        .setTitle('Temporary mute **EXPIRED**')
        .setColor('#000000');
      setTimeout(async function () {
        client.funcs.removeMute(member.id, msg.guild.id, msg.channel.id);
        if (embedMessage && d.channels.punishments) embedMessage.edit(embed);
      }, time);
    } else {
      setTimeout(async function () {
        client.funcs.removeMute(member.id, msg.guild.id, msg.channel.id);
      }, time);
    }
  },
};