module.exports = {
  run: async (param) => {
    const { futox, Discord, newMember } = param;
    let categoryRoles = [0];
    for (let i = 0; i < newMember.guild.roles.size; i++) {
      if (newMember.guild.roles.array()[i].name.startsWith('--')) {
        categoryRoles.push(newMember.guild.roles.array()[i].position);
      }
    }
    categoryRoles.sort();
    let roles = newMember.roles.filter(x => !x.name.startsWith('--') && !x.name.startsWith('@'));
    for (let i = 1; i < categoryRoles.length; i++) {
      if (!roles.find(x => x.position > categoryRoles[i])) {
        newMember.removeRole(newMember.guild.roles.find(x => x.position === categoryRoles[i]));
      }
      if (roles.find(x => x.position < categoryRoles[i] && x.position > categoryRoles[i - 1]) && roles.find(x => x.position > categoryRoles[i])) {
        newMember.addRole(newMember.guild.roles.find(x => x.position === categoryRoles[i]));
      }
    }
  },
};