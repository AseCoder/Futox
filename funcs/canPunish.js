module.exports = function ({ client, guildId, punishmentType, punisherMember, punishedMember, }) {
  const roles = client.global.db.guilds[guildId].roles.staff;
  if (!roles.staff) {}
  if (punisherMember.roles.has(role.staff)) {
    if (['MUTE', 'WARN'].includes(punishmentType)) {

    } else return false;
  }
};