module.exports = {
  run: (msg) => {
    msg.channel.send(`G'day, **${msg.member.displayName}**!`);
  },
};