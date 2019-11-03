module.exports = {
  run: async (client, Discord, message) => {
    if (!message.guild || (message.author.bot && message.author.id !== "542971464740241419") || (!client.global.core_devs.map(x => x.id).includes(message.author.id) && client.user.id === '626825158145081352')) return;
    const d = client.global.db.guilds[message.guild.id];
    if (d.mutes.map(x => x.id).includes(message.author.id)) {
      message.delete();
      return message.reply(`you are muted!`).then(m => m.delete(2500));
    }
    const args = message.content.split(' ').slice(1);

    if (d.channels.swear_detection && d.swear_detection) {
      let output = client.funcs.handleProfanities(message, false, Discord, client);
      if (output[0] === false && output[1] !== false) {
        if (output[2] === true) {
          client.funcs.sendInbotMessage(message.guild, d.channels.swear_detection, output[4], client);
        } else {
          message.delete();
          message.channel.send(`${message.member}, No swearing!`);
          client.funcs.sendInbotMessage(message.guild, d.channels.swear_detection, output[4], client);
          return;
        }
      }
    }

    // actual commands
    if (message.content.startsWith(client.global.db.guilds[message.guild.id].prefix) || (!message.content.startsWith(client.global.db.guilds[message.guild.id].prefix) && message.mentions.members.first() && message.mentions.members.first().user.id === client.user.id)) {
      let command = '';
      if (message.content.startsWith(client.global.db.guilds[message.guild.id].prefix)) {
        command = message.content.split(' ')[0].slice(client.global.db.guilds[message.guild.id].prefix.length);
      } else {
        command = message.content.split(' ')[1];
        message.mentions.members.delete(client.user.id);
        args.shift();
        message.content = message.content.split(' ').slice(1).join(' ');
      }
      if (client.commands.has(command)) {
        const permissions = message.channel.permissionsFor(client.user);
        if (!permissions.has('EMBED_LINKS')) return message.channel.send('Missing permission: Embed links!');
        try {
          await client.commands.get(command).execute(message, args, client, Discord);
        } catch (error) {
          console.log(error);
          message.channel.send('An error occured while completing that command. The core developers will fix this as soon as they can.');
          if (!client.global.locally_hosted) {
            const embed = new Discord.RichEmbed()
              .setTitle(`FutoX ${error.toString()}`)
              .setDescription(error.stack.replace(/at /g, '\n\n**at **'))
              .setFooter(`In ${message.guild.name} (${message.guild.id}) by ${message.author.tag} (${message.author.id})\nMessage: "${message.content}"`)
              .setColor(client.colors.botGold);
            client.channels.get('637933610607050754').send(embed);
          }
        }
      }
    }
  },
};
