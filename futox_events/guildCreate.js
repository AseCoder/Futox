module.exports = {
  run: async (param) => {
    const { futox, Discord, guild } = param;
    console.log(`- New guild added! ${guild.name}, ${guild.id} -`);
    futox.db.collection('guilds').doc(guild.id).set({
      roles: {
        highest_role: guild.owner.highestRole.id,
      },
      channels: {},
      mutes: [],
      warnings: [],
      prefix: '!',
      swear_detection: false,
    });
    futox.global.db.guilds[guild.id] = {
      roles: {
        highest_role: guild.owner.highestRole.id,
      },
      channels: {},
      mutes: [],
      warnings: [],
      prefix: '!',
      swear_detection: false,
    };
    const embed = new Discord.RichEmbed()
      .setTitle(`Hello, I am ${futox.user.username}! I noticed, that you have added ${futox.user.username} to your server (${guild.name}). Please take a look at this user manual:`)
      .setDescription(`The default prefix is \`!\`. This can be changed with the \`!setprefix [new prefix]\` command.\n\nBy default, swear word detection is turned off. This can be turned on by using the \`!sweardetection [boolean]\` command.\n\nYou can also configure which role is added to people when they join your server, a rules channel and much more. Use \`!roles\` and \`!channels\` for more information.\n\nThe commands above are only available to the owner of the server (${guild.owner}) in any of the server's (${guild.name}) text channels.\n\nYou can see all my commands with the \`!help\` command.\n\n_Also, this beautiful yellow-ish orange color you are seeing is **#FFBD06** or (255, 189, 6) in RGB._`)
      .setColor(futox.colors.botGold)
    /*
    guild.owner.send(embed);
    if (guild.owner.user.presence.status !== 'online') {
      let channel = guild.channels.find(x => (x.type === 'text' && (x.name.toUpperCase().includes('ANNOUNCEMENTS') || x.name.toUpperCase().includes('GENERAL') || x.name.toUpperCase().includes('TEXT'))) || (x.type === 'category' && (x.name.toUpperCase().includes('TEXT') || x.name.toUpperCase().includes('INFO'))));
      if (channel === null) channel = guild.channels.find(x => x.type === 'text');
      if (channel === null) return;
      if (channel.type === 'category') channel = channel.children.first();
      setTimeout(function () {
        channel.send(`I\'ve DM\'ed the owner of this server (${guild.owner}) a user manual with lots of useful information. This message will be automatically deleted after 1 minute.`).then(msg => {
          setTimeout(function () {
            if (!msg.deleted) msg.delete();
          }, 60000);
        }).catch(err => {});
      }, 5000);
    }
    */
  },
};