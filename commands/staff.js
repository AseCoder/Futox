module.exports = {
  name: 'staff',
  usage: '',
  description: 'See all staff members',
  category: 'info',
  async execute(msg, args, client, Discord) {
    if (!client.global.db.guilds[msg.guild.id].roles.staff) return msg.channel.send('This server has no `staff` role. I do not what a staff member is.');
    let staff = msg.guild.members.filter(x => x.roles.has(client.global.db.guilds[msg.guild.id].roles.staff) && !x.user.bot).map(x => x.displayName);
    msg.channel.send(`Staff members: **${staff.join(', ')}**`);
  },
};
