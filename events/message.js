module.exports = {
  run: (msg) => {
    if (!msg.content.startsWith(global.Client.defPrefix)) return;
    const cmdName = msg.content.slice(global.Client.defPrefix.length).split(' ')[0];
    if (!global.Client.commands.has(cmdName)) return;
    if (!msg.member.hasPermission('SEND_MESSAGES')) return;
    if (!msg.member.hasPermission('EMBED_LINKS')) return msg.channel.send('I need permission to Embed Links in order to function properly.');
    try {
      global.Client.commands.get(cmdName).run(msg);
    } catch (error) {
      msg.channel.send('Ah buggers, something\'s gone wrong! Don\'t panic, i\'ll tell the developers to fix it.');
    }
  },
};