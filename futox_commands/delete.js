module.exports = {
  name: 'delete',
  usage: '[amount]',
  description: 'Clear messages',
  category: 'moderation',
  async execute(msg, args, client, Discord) {
    const permissions = msg.channel.permissionsFor(msg.client.user);
    if (!permissions.has('MANAGE_MESSAGES')) return msg.channel.send('Missing permission: Manage messages!');
    if (!msg.member.hasPermission('MANAGE_MESSAGES')) return msg.channel.send(client.global.replies.notAllowed);
    if (!args[0]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0]);
    var delAmount = parseInt(args[0]);
    if (delAmount === 0) return msg.channel.send('Trying to be funny, eh?');
    if (delAmount > 100) return msg.channel.send('You can only delete **100** messages at a time!');
    await msg.delete();
    msg.channel.fetchMessages({ limit: delAmount })
      .then(async msgs => {
        msg.channel.bulkDelete(delAmount).then((messages) => {
          messages.first().channel.send(`Successfully deleted **${delAmount}** messages.`).then(message => message.delete(6781));
        })
      });
  },
};