module.exports = {
  run: () => {
    const { guild, role } = global.Client.coreDevs;
    global.Client.coreDevs.ids = global.Client.guilds.get(guild).roles.get(role).members.map(x => x.user.id);
    return global.Client.coreDevs.ids;
  },
};