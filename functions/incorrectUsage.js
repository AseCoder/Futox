module.exports = {
  run: async (cmdName, channelID) => {
    const command = global.commands.get(cmdName);
    const embed = new global.Embed()
      .setTitle('Ay mate, that\'s **incorrect usage**!')
      .setDescription(`See below for correct usage:\n\`!${cmdName} ${command.usage.map(x => `[${x}]`).join(' ')}\``)
    global.Client.channels.get(channelID).send(embed);
  },
};