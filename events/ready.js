module.exports = {
  run: async () => {
    console.log(`- Ready as ${global.Client.user.tag} -`);

    global.Client.user.setPresence({
      status: global.activity.status,
      activity: {
        type: global.activity.type,
        name: global.activity.name,
      },
    });
    console.log(`- Presence Set -`);

    const ids = global.loadCoreDevs();
    console.log(`- ${ids.length} Core Devs Loaded -`);

  },
};