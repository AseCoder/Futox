module.exports = {
  run: async (param) => {
    const { futox, Discord, guild } = param;
    console.log(`- New guild added! ${guild.name}, ${guild.id} -`);
    const owner = await guild.fetchMember(guild.ownerID);
    let highest_role;
    if (owner.highestRole) {
      highest_role = owner.highestRole.id;
    } else {
      highest_role = guild.roles.find(x => x.calculatedPosition === guild.roles.size - 1)
    }
    futox.global.db.guilds[guild.id] = {
      roles: {
        highest_role,
      },
      channels: {},
      mutes: [],
      warnings: [],
      prefix: '!',
      swear_detection: false,
    };
    const embed = new Discord.RichEmbed()
      .setTitle(`Hello, I am ${futox.user.username}! I noticed that you have added ${futox.user.username} to your server (${guild.name}). Please take a look at this user manual:`)
      .setDescription(`The default prefix is \`!\`. This can be changed with the \`!setprefix [new prefix]\` command.\n\nBy default, swear word detection is turned off. This can be turned on by using the \`!sweardetection [boolean]\` command.\n\nYou can also configure which role is added to people when they join your server, a rules channel and much more. Use \`!roles\` and \`!channels\` for more information.\n\nThe commands above are only available to the owner of the server (${guild.owner}) in any of the server's (${guild.name}) text channels.\n\nYou can see all my commands with the \`!help\` command.\n\n_Also, this beautiful yellow-ish orange color you are seeing is **#FFBD06** or (255, 189, 6) in RGB._`)
      .setColor(futox.colors.botGold)
  },
};