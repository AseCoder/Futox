// Copyright (c) 2019 AseCoder
module.exports = function (key, guild) {
  let foundRoles = []; // roles which's name includes key in some way
  if (!key) return `extCode: noQuery`; // if no role was searched, return early
  const probabilityIncrement = 100 / key.split(' ').length / 2; // probability increase / decrease increment
  for (let i = 0; i < key.split(' ').length; i++) { // add stuff to foundRoles
    guild.roles.filter(x => x.name.toUpperCase().includes(key.split(' ')[i].toUpperCase()) || x.id === key).forEach(x => foundRoles.push({ id: x.id, name: x.name, probability: probabilityIncrement }));
  }
  if (foundRoles.length === 0) return `extCode: noResults`
  for (let i = 0; i < foundRoles.length; i++) { // remove duplicate roles in foundRoles
    for (let j = 0; j < foundRoles.length; j++) {
      if (foundRoles[i].id === foundRoles[j].id && i !== j) foundRoles.splice(i, 1);
    }
  }
  for (let i = 0; i < foundRoles.length; i++) { // change probabilities
    if (foundRoles[i].name.length > key.length) { // reduce or increase probability depending on length of foundRoles [i] name and key
      foundRoles[i].probability -= (foundRoles[i].name.split(' ').length - key.split(' ').length) * (probabilityIncrement * 0.5);
    } else if (foundRoles[i].name.length === key.length) {
      foundRoles[i].probability += (probabilityIncrement * 0.9);
    }

    // decrease probability if name does not contain key words
    for (let j = 0; j < key.split(' ').length; j++) {
      if (!foundRoles[i].name.toUpperCase().includes(key.toUpperCase().split(' ')[j])) {
        foundRoles[i].probability -= (probabilityIncrement * 0.5);
      }
    }

    // increase probability based on amount of role holders
    foundRoles[i].probability += (guild.roles.get(foundRoles[i].id).members.size - 1) * (probabilityIncrement * (guild.memberCount * 0.008));
  }
  let highestProbabilityRole;
  console.log('Roles found: ', foundRoles);
  for (let i = 0; i < foundRoles.length; i++) { // select highest probability role, assign to variable, if many roles with same prob., select one with less position 
    if (!highestProbabilityRole || highestProbabilityRole.probability < foundRoles[i].probability) highestProbabilityRole = foundRoles[i];
    if (highestProbabilityRole && highestProbabilityRole.probability === foundRoles[i].probability && guild.roles.get(highestProbabilityRole.id).calculatedPosition > guild.roles.get(foundRoles[i].id).calculatedPosition) {
      highestProbabilityRole = foundRoles[i];
    }
  }
  return guild.roles.get(highestProbabilityRole.id);
};
