module.exports = {
  run: (msg) => {
    if (!msg.content.startsWith(global.Client.defPrefix)) return;
    const cmdName = msg.content.slice(global.Client.defPrefix.length).split(' ')[0];
    if (!global.Client.commands.has(cmdName)) return;
    global.Client.commands.get(cmdName).run(msg);
  },
};