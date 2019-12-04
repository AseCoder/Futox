module.exports = {
  run: () => {
    console.log(`- Ready as ${global.Client.user.tag} -`);

    global.Client.user.setPresence({
      status: global.Client.activity.status,
      activity: {
        type: global.Client.activity.type,
        name: global.Client.activity.name,
      },
    });
    console.log(`- Presence Set -`);

    const ids = global.Client.funcs.loadCoreDevs();
    console.log(`- ${ids.length} Core Devs Loaded -`);

  },
};