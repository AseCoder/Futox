module.exports = {
  run: async (param) => {
    const { futox, Discord, guild } = param;
    delete futox.global.db.guilds[guild.id];
  },
};