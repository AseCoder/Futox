module.exports = function (msg, edited, Discord, futox) {
  let regex;
  let returnArray = [undefined, false, undefined, undefined];
  /*
    0: channel nsfw? bool
    1: p or sp
    2: sender a bot? bool
    3: message edited? bool
    4: embed
  */
  let p = ['DICK', 'PORN', 'FUCK', 'SHIT', 'TRIGGERFUTO'];
  let sp = ['ASS', 'VAGINA', 'MORON', 'TRIGGERSOFTFUTO', 'SEX', 'BITCH', 'NIGGER', 'SH1T', 'SHLT', 'FUC', 'FUCC', 'FUK', 'FUKK', 'FUKC', 'PENIS', 'IDIOT', 'NOOB', 'PUSSY', 'BOOBS', 'TITS',];
  let embed = new Discord.RichEmbed()
    .setTitle('**Someone Swore!**')
    .addField('Detected User:', `${msg.member} (${msg.author.id})`)
    .setFooter('Staff, react with ⚠ to warn this member.')
    .setColor(futox.colors.botGold)
  returnArray[0] = msg.channel.nsfw;
  returnArray[2] = msg.author.bot;
  returnArray[3] = edited;
  for (let i = 0; i < p.length + sp.length; i++) {
    if (msg.content.toUpperCase().includes(p[i])) {
      returnArray[1] = 'p';
      regex = new RegExp(p[i], 'gi');
      embed.addField(`Violated Profanity No. ${i + 1} (${p[i].toLowerCase()}):`, msg.content.length > 1024 ? msg.content.replace(regex, `**${p[i]}**`).slice(0, 1021) + '...' : msg.content.replace(regex, `**${p[i]}**`));
    }
    if (msg.content.toUpperCase().includes(sp[i])) {
      if (!returnArray[1]) returnArray[1] === 'sp';
      regex = new RegExp(sp[i], 'gi');
      embed.addField(`Violated Soft Profanity No. ${i + 1} (${sp[i].toLowerCase()}):`, msg.content.length > 1024 ? msg.content.replace(regex, `**${sp[i]}**`).slice(0, 1021) + '...' : msg.content.replace(regex, `**${sp[i]}**`));
    }
  }
  embed.addField('Channel:', msg.channel);
  returnArray[4] = embed;
  return returnArray;
};