module.exports = {
  run: function (param) {
    console.log('role deleted');
    const { futox, role, Discord } = param;
    const roleids = Object.values(futox.global.db.guilds[role.guild.id].roles);
    if (roleids.includes(role.id)) {
      const deletedRolesAmount = roleids.filter(x => x === role.id).length;
      for (let i = 0; i < deletedRolesAmount; i++) {
        const type = Object.keys(futox.global.db.guilds[role.guild.id].roles)[Object.values(futox.global.db.guilds[role.guild.id].roles).indexOf(role.id)];
        delete futox.global.db.guilds[role.guild.id].roles[type];
        console.log('role', role.name, 'deleted, type', type);
      }
    }
    // staff_roles becuase its an array
    if (futox.global.db.guilds[role.guild.id].roles.staff_roles) {
      const staffroleids = futox.global.db.guilds[role.guild.id].roles.staff_roles;
      if (staffroleids.includes(role.id)) {
        futox.global.db.guilds[role.guild.id].roles.staff_roles = futox.global.db.guilds[role.guild.id].roles.staff_roles.filter(x => x !== role.id);
      }
    }
  },
};