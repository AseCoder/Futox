module.exports = {
  run: function (param) {
    const { futox, Discord, oldMember, newMember } = param;
    if (oldMember.presence.status !== newMember.presence.status && [oldMember.presence.status, newMember.presence.status].filter(x => x === 'offline').length === 1) {
      futox.global.lastOnline[newMember.user.id] = {
        currentlyOnline: newMember.presence.status !== 'offline',
        status: newMember.presence.status === 'offline' ? 'offline' : 'online',
        since: Date.now(),
      }
    }
  },
};