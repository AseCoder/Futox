module.exports = {
  usage: ['User'],
  run: async (msg, args, cmdName) => {
    if (!args[0]) return global.incorrectUsage(cmdName, msg.channel.id);
    const user = await global.findMember(args[0], msg.guild.id) || await global.getUser(args[0]);
    console.log(user.tag);
    const embed = new global.Embed();
    embed.setTitle();
  },
};