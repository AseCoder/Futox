module.exports = {
  run: async (param) => {
    const { futox, Discord, newMessage } = param;
    if (!newMessage.guild) return;
    const d = futox.global.db.guilds[newMessage.guild.id];
    if (!d.channels.swear_detection) return;
    let output = futox.funcs.handleProfanities(newMessage, true, Discord, futox);
    if (output[0] === false && output[1] !== false) {
      if (output[2] === true) {
        futox.funcs.sendInbotMessage(msg.guild, d.channels.swear_detection, output[4], futox);
      } else {
        msg.delete();
        msg.channel.send(`${msg.member}, No swearing!`);
        futox.funcs.sendInbotMessage(msg.guild, d.channels.swear_detection, output[4], futox);
        return;
      }
    }
  },
};