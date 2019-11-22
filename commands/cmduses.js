module.exports = {
  name: 'cmduses',
  usage: '',
  description: 'Command usage statistics',
  category: 'info',
  async execute(msg, args, client, Discord) {
    const cmduses = [];
    client.commands.forEach((value, key) => {
      cmduses.push([key, value.uses]);
    });
    cmduses.sort((a, b) => {
      return b[1] - a[1];
    });
    const cmdnamelength = Math.max(...cmduses.map(x => x[0].length)) + 4;
    const numberlength = Math.max(...cmduses.map(x => x[1].toString().length), 4);
    const markdownrows = ['Command' + ' '.repeat(cmdnamelength - 'command'.length) + ' '.repeat(numberlength - 'uses'.length) + 'Uses'];
    cmduses.forEach(x => {
      if (x[1] > 0) markdownrows.push(x[0] + '.'.repeat(cmdnamelength - x[0].length) + ' '.repeat(numberlength - x[1].toString().length) + x[1].toString());
    });
    const embed = new Discord.RichEmbed();
    embed
      .setTitle('FutoX Command Usage During Current Uptime')
      .setDescription('```ml\n' + markdownrows.join('\n') + '\n```')
      .setFooter('These statistics are from the current uptime.')
      .setColor(client.colors.botGold);
    msg.channel.send(embed);
  },
};