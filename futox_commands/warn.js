module.exports = {
  name: 'warn',
  usage: '[User]',
  description: 'Warn this user. Warnings expire after 10 days.',
  category: 'punishing',
  async execute(msg, args, client, Discord) {
    if (!msg.member.hasPermission('KICK_MEMBERS', true, true)) return msg.channel.send(client.global.replies.notAllowed);
    if (!args[0]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0], client);
    var member = client.funcs.fetchMember(args[0], msg);
    if (!member) return msg.channel.send(client.global.replies.noMember);
    if (member.hasPermission('KICK_MEMBERS', true, true)) return msg.channel.send('I can\'t warn them.');
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