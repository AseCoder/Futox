module.exports = {
  run: async (param) => {
    const { futox, Discord, dbl } = param;
    const path = require('path');
    const fs = futox.npm.fs;
    const remoteGuildData = await futox.funcs.dbget('guilds', null, futox);
    remoteGuildData.forEach(guildData => {
      futox.global.db.guilds[guildData.id] = guildData.d;
      if (futox.user.id === '626825158145081352') {
        futox.global.db.guilds[guildData.id].prefix = '*';
      }

      // remove mutes
      if (futox.global.db.guilds[guildData.id].mutes.length > 0) {
        futox.global.db.guilds[guildData.id].mutes.forEach(mute => {
          if (mute.timestamp < Date.now()) {
            futox.global.db.guilds[guildData.id].mutes.splice(futox.global.db.guilds[guildData.id].mutes.map(x => x.timestamp).indexOf(mute.timestamp), 1);
          }
        });
      }

      // remove warnings
      if (futox.global.db.guilds[guildData.id].warnings.length > 0) {
        futox.global.db.guilds[guildData.id].warnings.forEach(warning => {
          if (warning.timestamp < Date.now()) {
            futox.global.db.guilds[guildData.id].warnings.splice(futox.global.db.guilds[guildData.id].warnings.map(x => x.timestamp).indexOf(warning.timestamp), 1);
          }
        });
      }
    });

    const remoteSpecs = await futox.funcs.dbget('specs', null, futox);
    remoteSpecs.forEach(specsObj => {
      futox.global.db.specs[specsObj.id] = specsObj.d;
    });
    console.log('- FutoX DB Set -');

    if (futox.user.id === '626825158145081352') {
      await futox.user.setActivity(`outdated bots | 🍾`, { type: 'WATCHING' });
      await futox.user.setStatus('online');
    } else {
      await futox.user.setActivity(`${futox.guilds.size} servers | 🐋`, { type: 'WATCHING' });
      await futox.user.setStatus('idle');
    }
    console.log('- FutoX Activity Set -');

    console.log('- FutoX Activated -');

    let pastDbJSON = JSON.stringify(futox.global.db);
    futox.unsaved_db = false;
    setInterval(async () => {
      futox.global.pings.push(futox.ping);
      if (futox.global.pings.length > 50) futox.global.pings.shift();
    }, 30000);
    futox.global.dbwrite.nextAttemptTimestamp = Date.now() + 1200000
    setInterval(async () => {
      if (pastDbJSON !== JSON.stringify(futox.global.db)) {
        pastDbJSON = JSON.stringify(futox.global.db);
        futox.global.dbwrite.unsavedChanges = true;
      } else {
        futox.global.dbwrite.unsavedChanges = false;
      }
      futox.global.dbwrite.lastAttempt.timestamp = Date.now();
      futox.global.dbwrite.nextAttemptTimestamp = Date.now() + 1200000;
      if (futox.global.dbwrite.unsavedChanges) {
        futox.global.dbwrite.lastAttempt.success = true;
        futox.guilds.forEach(guild => {
          futox.db.collection('guilds').doc(guild.id).set(futox.global.db.guilds[guild.id]);
        });
        for (let i = 0; i < Object.keys(futox.global.db.specs).length; i++) {
          futox.db.collection('specs').doc(Object.keys(futox.global.db.specs)[i]).set(Object.values(futox.global.db.specs)[i]);
        }
      } else {
        futox.global.dbwrite.lastAttempt.success = false;
      }
    }, 1200000);
    setInterval(() => {
      futox.user.setActivity(`${futox.guilds.size} servers | 🐋`, { type: 'WATCHING' });
      //dbl.postStats(futox.guilds.size);
    }, 1800000);
  },
};