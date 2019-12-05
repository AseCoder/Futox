module.exports = {
  run: () => {
    const { guild, role } = global.coreDevs;
    global.coreDevs.ids = global.Client.guilds.get(guild).roles.get(role).members.map(x => x.user.id);
    return global.coreDevs.ids;
  },
};