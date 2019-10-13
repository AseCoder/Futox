module.exports = {
  name: 'delwarn',
  usage: '[User]',
  description: 'Delete a warning from this user',
  category: 'moderation',
  async execute(msg, args, client, Discord) {
    if (!msg.member.hasPermission('KICK_MEMBERS', true, true)) return msg.channel.send(client.global.replies.notAllowed);
    if (!args[0]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0], client);
    let member = client.funcs.fetchMember(args.join(' '), msg);
    if (!member) return msg.channel.send(client.global.replies.noMember);
    if (!client.global.db.guilds[msg.guild.id].warnings.map(x => x.id).includes(member.user.id)) return msg.channel.send('This user currently has no warnings.');
    client.funcs.removeWarn(member.user.id, msg.guild.id);
    msg.channel.send(`Removed a warning from **${member.user.tag}**. They now have **${client.global.db.guilds[msg.guild.id].warnings.filter(x => x.id === member.user.id).length}** warnings.`);
  },
};