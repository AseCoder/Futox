module.exports = {
  usage: ['User'],
  run: async (msg, args, cmdName) => {
    if (!args[0]) return global.incorrectUsage(cmdName, msg.channel.id);
    const user = await global.findMember(args[0], msg.guild.id) || await global.getUser(args[0]);
    const embed = new global.Embed();
    embed.setTitle(`Information About ${user.tag || user.user.tag}:`);
    if (user.user) {
      embed.setDescription(`:small_orange_diamond: Server Information:\n❯ Nickname: ${user.nickname || 'None'}\n❯ Roles: ${user.roles.array().sort((a, b) => {
        return b.position - a.position;
      }).slice(0, -1).map(x => `<@&${x.id}>`).join(' ')}`);
    }

    msg.channel.send(embed);
  },
};