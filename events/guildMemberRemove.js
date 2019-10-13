module.exports = {
  run: async (param) => {
    const { futox, Discord, member } = param;
    const d = futox.global.db.guilds[member.guild.id];
    if (d.channels.member_logs) {
      const embed = new Discord.RichEmbed()
        .setTitle('User Left')
        .setDescription(member.user)
        .setColor(futox.colors.botGold)
      member.guild.channels.get(d.channels.member_logs).send(embed);
    }
  }
};