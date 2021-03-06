module.exports = {
  name: 'userinfo',
  usage: '[User]',
  description: 'See info about this user',
  category: 'info',
  async execute(msg, args, client, Discord) {
    if (!args[0]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0], client);
    let member = client.funcs.fetchMember(args.join(' '), msg);
    if (!member) return msg.channel.send('I could not obtain The User');
    let game = member.user.presence.game ? member.user.presence.game.name : 'None';
    const embed = new Discord.RichEmbed()
      .setTitle(`User Info of ${member.user.tag}:`)
      .setDescription(`ID: ${member.user.id}\nNickname: ${member.nickname ? member.nickname : 'None'}`)
      .setThumbnail(member.user.displayAvatarURL)
      .addField(`:robot: This User ${member.user.bot ? '**Is**' : '**Is Not**'} a Bot`, '\u200b', true)
      .addField(`:watch: Status: ${member.user.presence.status.slice(0, 1).toUpperCase() + member.user.presence.status.slice(1)}`, '\u200b', true)
      .addField(`:small_orange_diamond: Account Creation Time: ${client.npm.moment(member.user.createdTimestamp).format('D.M.Y')}`, '\u200b', true)
      .addField(`:small_orange_diamond: Server Join Time: ${client.npm.moment(member.joinedTimestamp).format('D.M.Y')}`, '\u200b', true)
      .addField(`:space_invader: Current Game: ${game}`, '\u200b', true)
      .addField(`:${['offline', 'idle'].includes(member.presence.status) ? 'sleeping' : 'smiley'}: Current Status: ${member.presence.status.split('').map((v, i) => i === 0 ? v.toUpperCase() : v).join('')}${client.global.lastOnline[member.user.id] ? `, ${client.global.lastOnline[member.user.id].status} since ${client.npm.moment(client.global.lastOnline[member.user.id].since).fromNow()}` : ''}`, '\u200b', true)
      .addField(`:camera: Avatar URL`, `[Click Here](${member.user.defaultAvatarURL})`, true)
      .setColor(member.highestRole.hexColor === '#000000' ? '#95a5a6' : member.highestRole.hexColor)
      .setFooter('All dates are in EU format.')
    msg.channel.send(embed);
  },
};