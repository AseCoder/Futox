module.exports = {
  run: async function (param) {
    console.log('role deleted');
    const { futox, role, Discord } = param;
    let roles = Object.entries(futox.global.db.guilds[role.guild.id].roles);
    if (roles.map(x => x[1]).includes(role.id)) { // deleted role is in roles
      if (roles.find(x => x[0] === 'highest_role' && x[1] === role.id)) { // deleted role was highest_role
        const guild = role.guild;
        const owner = await guild.fetchMember(guild.ownerID);
        if (owner.highestRole) {
          roles.find(x => x[0] === 'highest_role' && x[1] === role.id)[1] = owner.highestRole.id;
        } else {
          roles.find(x => x[0] === 'highest_role' && x[1] === role.id)[1] = guild.roles.find(x => x.calculatedPosition === guild.roles.size - 1)
        }
      }
      roles = roles.filter(x => x[1] !== role.id);
      futox.global.db.guilds[role.guild.id].roles = Object.fromEntries(roles);
    }
    // staff_roles becuase its an array
    if (futox.global.db.guilds[role.guild.id].roles.staff_roles && futox.global.db.guilds[role.guild.id].roles.staff_roles.includes(role.id)) {
      futox.global.db.guilds[role.guild.id].roles.staff_roles = futox.global.db.guilds[role.guild.id].roles.staff_roles.filter(x => x !== role.id);
      if (futox.global.db.guilds[role.guild.id].roles.staff_roles.length === 0) delete futox.global.db.guilds[role.guild.id].roles.staff_roles;
    }
  },
};