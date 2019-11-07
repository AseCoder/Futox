module.exports = {
  name: 'warn',
  usage: '[User]',
  description: 'Warn this user. Warnings expire after 10 days.',
  category: 'punishing',
  async execute(msg, args, client, Discord) {
    if (!args[0]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0], client);
    const member = client.funcs.fetchMember(args[0], msg);
    if (!member) return msg.channel.send(client.global.replies.noMember);
    if (member.user.id === client.user.id) return msg.channel.send('I can\'t warn myself!');
    const canPunish = client.funcs.canPunish({
      client,
      guildId: msg.guild.id,
      punishmentType: 'WARN',
      punisherMember: msg.member,
      punishedMember: member,
    });
    if (!canPunish.result) return msg.channel.send(canPunish.errorMessage);
    client.global.db.guilds[msg.guild.id].warnings.push({
      id: member.user.id,
      timestamp: Date.now() + 864000000,
    });
    const d = client.global.db.guilds[msg.guild.id];
    msg.channel.send(`Successfully warned **${member.user.tag}**, they currently have **${d.warnings.filter(x => x.id === member.user.id).length}** warnings`);

    setTimeout(async function () {
      await client.funcs.removeWarn(member.id, msg.guild.id);
    }, 864000000);
  },
};