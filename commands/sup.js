module.exports = {
  desc: 'Receive an Australian greeting',
  run: async (msg, args, cmdName) => {
    msg.channel.send(`G'day, **${msg.member.displayName}**!`);
  },
};