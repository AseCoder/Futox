module.exports = {
  name: 'sweardetection',
  usage: '[boolean]',
  description: 'Change this server\'s swear detection preferences',
  category: 'utility',
  async execute(msg, args, client, Discord) {
    if (!msg.member.roles.has(msg.guild.owner.highestRole.id)) return msg.channel.send(`Only people with the **${msg.guild.owner.highestRole.name}** role can change the swear detection preferences.`);
    const permissions = msg.channel.permissionsFor(msg.client.user);
    if (!permissions.has('MANAGE_MESSAGES')) return msg.channel.send('Missing permission: Manage messages!');
    if (!args[0]) return msg.channel.send(`Current swear detection preferences: \`${client.global.db.guilds[msg.guild.id].swear_detection}\``);
    if (!['true', 'false'].includes(args[0].toLowerCase())) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0]);
    client.global.db.guilds[msg.guild.id].swear_detection = args[0].toLowerCase() === 'true' ? true : false;
    msg.channel.send(`New swear detection preference set: \`${args[0]}\``);
  },
};