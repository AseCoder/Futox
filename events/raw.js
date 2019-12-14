module.exports = {
  run: async (param) => {
    const { futox, Discord, event, } = param;
    const d = futox.global.db.guilds[event.d.guild_id];
    if (!d.channels.rules || !d.channels.swear_detection || !d.roles.verified) return;
    if (event.d.user_id === futox.user.id) return;
    if (event.d.channel_id !== d.channels.rules) return;
    if (event.d.emoji.name !== '✅') return;
    if (event.t === 'MESSAGE_REACTION_ADD') {
      const embed = new Discord.RichEmbed()
        .setTitle('**Someone agreed with the rules!**')
        .addField('User:', await futox.guilds.get(event.d.guild_id).fetchMember(event.d.user_id))
        .setColor('#00ff00')
      futox.guilds.get(event.d.guild_id).channels.get(d.channels.swear_detection).send(embed);
      futox.guilds.get(event.d.guild_id).fetchMember(event.d.user_id).then(m => {
        m.addRole(d.roles.verified);
      });
    } else if (event.t === 'MESSAGE_REACTION_REMOVE') {
      const embed = new Discord.RichEmbed()
        .setTitle('**Someone disagreed with the rules!**')
        .addField('User:', await futox.guilds.get(event.d.guild_id).fetchMember(event.d.user_id))
        .setColor('#ff0000')
      futox.guilds.get(event.d.guild_id).channels.get(d.channels.swear_detection).send(embed);
      futox.guilds.get(event.d.guild_id).fetchMember(event.d.user_id).then(m => {
        m.removeRole(d.roles.verified);
      });
    }
  }
};
