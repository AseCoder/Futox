module.exports = async function (id, guildId, channelId, futox) {
  if (futox.global.db.guilds[guildId].mutes.map(x => x.id).includes(id)) {
    futox.global.db.guilds[guildId].mutes.splice(futox.global.db.guilds[guildId].mutes.map(x => x.id).indexOf(id), 1);
    futox.channels.get(channelId).send(`${await futox.guilds.get(guildId).fetchMember(id)}, you have been unmuted.`);
  }
  return;
};