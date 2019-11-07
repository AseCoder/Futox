module.exports = function (param = { client, guildId, punishmentType, punisherMember, punishedMember, }) {
  const { client, guildId, punishmentType, punisherMember, punishedMember, } = param;
  const roles = client.global.db.guilds[guildId].roles;
  let required;
  let hasRequired;
  let higherInHierarchy;

  if (roles.staff) {
    if (['MUTE', 'WARN'].includes(punishmentType)) {
      required = 'r:staff';
    }
  } else {
    if (['MUTE', 'WARN'].includes(punishmentType)) {
      required += 'p:MUTE_MEMBERS';
    }
  }
  if (roles.moderator) {
    if (['KICK', 'BAN'].includes(punishmentType)) {
      required = 'r:moderator';
    }
  } else { // staff, !moderator
    if (punishmentType === 'KICK') {
      required = 'p:KICK_MEMBERS';
    } else if (punishmentType === 'BAN') {
      required = 'p:BAN_MEMBERS';
    }
  }
  if (punisherMember.highestRole && punishedMember.highestRole) {
    higherInHierarchy = punisherMember.highestRole.calculatedPosition > punishedMember.highestRole.calculatedPosition;
  }
  if (client.global.core_devs.map(x => x.id).includes(punisherMember.user.id)) {
    if (!client.global.core_devs.map(x => x.id).includes(punishedMember.user.id)) {
      required = '';
      hasRequired = true;
      higherInHierarchy = true;
    }
  }
  if (required.startsWith('r:')) {
    hasRequired = punisherMember.roles.has(roles[required.slice(2)]);
  } else if (required.startsWith('p:')) {
    hasRequired = punisherMember.hasPermission(required.slice(2));
  }
  let errorMessage = undefined;
  if (!hasRequired || !higherInHierarchy) errorMessage = `You can not ${punishmentType.toLowerCase()} ${punishedMember.user.tag} because `;
  if (!hasRequired) {
    if (required.startsWith('r:')) {
      errorMessage += `you need the ${client.guilds.get(guildId).roles.get(roles[required.slice(2)]).name} role.`;
    } else {
      errorMessage += `you need the ${client.funcs.beautifyPermission(required.slice(2))} permission.`;
    }
  }
  if (!higherInHierarchy) errorMessage += `they are too powerful. (their highest role's calculated position is more than or equal to your highest role's calculated position)`
  return { hasRequired, higherInHierarchy, required, result: hasRequired && higherInHierarchy, errorMessage, };
};