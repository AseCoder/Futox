module.exports = {
  run: async (msg) => {
    if (!msg.content.startsWith(global.defPrefix)) return;
    const cmdName = msg.content.slice(global.defPrefix.length).split(' ')[0];
    if (!global.commands.has(cmdName)) return;
    if (!msg.member.hasPermission('SEND_MESSAGES')) return;
    if (!msg.member.hasPermission('EMBED_LINKS')) return msg.channel.send('I need permission to Embed Links in order to function properly.');
    const args = msg.content.split(' ').slice(1);
    try {
      global.commands.get(cmdName).run(msg, args, cmdName);
    } catch (error) {
      msg.channel.send('Ah buggers, something\'s gone wrong! Don\'t panic, i\'ll tell the developers to fix it.');
    }
  },
};