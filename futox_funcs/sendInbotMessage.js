module.exports = async function (guild, channelID, embed, futox) {
  let inbotMessage = await guild.channels.get(channelID).send(embed);
  inbotMessage.react('⚠');

  const filter = (reaction, user) => {
    return reaction.emoji.name === '⚠' && user.id !== futox.user.id;
  };

  let reactionCollector = inbotMessage.createReactionCollector(filter, { time: 172800000 });

  reactionCollector.on('collect', (element, collector) => {
    const userId = embed.fields[0].value.slice(element.embeds[0].fields[0].value.indexOf('('), -1);
    futox.global.db.guilds[guild.id].warnings.push({ id: userId, timestamp: Date.now() + 864000000 });
    setTimeout(function () {
      inbotMessage.clearReactions();
    }, 1000);
  });

  reactionCollector.on('end', (collected, reason) => {
    inbotMessage.clearReactions();
  });
};