module.exports = {
  name: 'removerole',
  usage: '[User] [role name]',
  description: 'Remove a role from someone',
  category: 'moderation',
  async execute(msg, args, client, Discord) {
    const permissions = msg.channel.permissionsFor(msg.client.user);
    if (!permissions.has('MANAGE_ROLES')) return msg.channel.send('Missing permission: Manage roles!');
    if (!msg.member.hasPermission('MANAGE_ROLES', true, true)) return msg.channel.send(client.global.replies.notAllowed);
    let admin = msg.member.highestRole.calculatedPosition;
    if (!args[1]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0], client);
    let rMember = client.funcs.fetchMember(args[0], msg);
    if (!rMember) return msg.channel.send(client.global.replies.noMember);
    const gRole = client.funcs.searchRole(args.slice(1).join(' '), msg.guild);
    if (gRole.toString().startsWith('extCode')) {
      const embed = new Discord.RichEmbed()
        .setTitle('Role could not be found.')
        .setDescription('An error occured while finding the role.')
        .setFooter(gRole)
        .setColor(client.colors.botGold)
      return msg.channel.send(embed);
    }
    if (gRole.position >= admin) return msg.channel.send('You\'re not allowed to mess with the **' + gRole.name + '** role!');
    if (!rMember.roles.has(gRole.id)) return msg.channel.send(`${rMember} doesn\'t have the **${gRole.name}** role.`);
    if (msg.guild.roles.find(x => x.name === client.user.username).calculatedPosition <= gRole.calculatedPosition) return msg.channel.send(`The role **${gRole.name}** is beyond my abilities. Not happening.`);
    rMember.removeRole(gRole.id);
    msg.channel.send(`Removed role **${gRole.name}** from **${rMember}**.`);
  },
};