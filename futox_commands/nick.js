module.exports = {
  name: 'nick',
  usage: '[new nickname]',
  description: 'Change your Discord nickname',
  category: 'utility',
  async execute(msg, args, client, Discord) {
    const permissions = msg.channel.permissionsFor(msg.client.user);
    if (!permissions.has('MANAGE_NICKNAMES')) return msg.channel.send('Missing permission: Manage nicknames!');
    if (!args[0]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0], client);
    await msg.member.setNickname(args.join(' ')).catch(e => {
      return msg.channel.send('I can\'t change your nickname.');
    });
    msg.channel.send(`Your nickname is now ${args.join(' ')}`);
  },
};