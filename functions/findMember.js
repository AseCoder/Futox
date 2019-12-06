module.exports = {
  run: (query, guildID) => {
    return new Promise(async (res, rej) => {
      const guildMembers = await global.Client.guilds.get(guildID).members.fetch();
      const member = guildMembers.find(x => x.displayName.toLowerCase().includes(query.toLowerCase()) || x.user.tag.toLowerCase().includes(query.toLowerCase()) || x.user.id.includes(query));
      res(member);
    });
  },
};