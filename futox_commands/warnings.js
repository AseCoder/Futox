module.exports = {
	name: 'warnings',
	usage: '[User]',
  description: 'See current warnings for this user or everyone with warnings',
  category: 'info',
	async execute(msg, args, client, Discord) {
    if (!msg.member.hasPermission('KICK_MEMBERS', true, true)) return msg.channel.send(client.global.replies.notAllowed);
    const d = client.global.db.guilds[msg.guild.id];
    if (!args[0]) {
      const warnings = d.warnings.filter(x => x !== '').map(x => x.id);
      const warningsObjects = [];
      warnings.forEach(w => {
        if (!warningsObjects.map(x => x.id).includes(w)) {
          warningsObjects.push({
            id: w,
            c: 1,
          });
        } else {
          warningsObjects[warningsObjects.map(x => x.id).indexOf(w)].c++;
        }
      });
      for (let i = 0; i < warningsObjects.length; i++) {
        const gM = msg.guild.members.get(warningsObjects[i].id);
        warningsObjects[i].id = gM.displayName;
      }
      console.log(warningsObjects);
      const embed = new Discord.RichEmbed()
        .setTitle(`All Warnings On ${msg.guild.name}:`)
        .setDescription(warningsObjects.map(x => `${x.id}**:** ${x.c}`).join('\n'))
        .setColor(client.colors.botGold)
      msg.channel.send(embed);
    } else {
      const member = client.funcs.fetchMember(args[0], msg);
      if (!member) return msg.channel.send(client.global.replies.noMember);
      const warnings = d.warnings.filter(x => x.id === member.user.id).length;
      const embed = new Discord.RichEmbed()
        .setTitle(`All Warnings Of ${member.user.tag} on ${msg.guild.name}:`)
        .setDescription(warnings > 0 ? `Warnings for ${member.user.tag}: ${warnings}` : 'No warnings.')
        .setColor(client.colors.botGold)
      msg.channel.send(embed);
    }
  },
};