module.exports = function (id, guildId) {
  futox.global.db.guilds[guildId].warnings.splice(futox.global.db.guilds[guildId].warnings.map(x => x.id).indexOf(id), 1);
  return;
};