module.exports = {
  name: 'channels',
  usage: '[channel type] [channel]',
  description: 'Change this server\'s channel preferences',
  category: 'utility',
  async execute(msg, args, client, Discord) {
    const permissions = msg.member.permissions;
    if (!msg.member.roles.has(client.global.db.guilds[msg.guild.id].roles.highest_role) && !permissions.hasPermission('ADMINISTRATOR') || !client.global.core_devs.map(x => x.id).includes(msg.author.id)) return msg.channel.send(`Only people with the **${msg.guild.roles.get(client.global.db.guilds[msg.guild.id].roles.highest_role).name}** role or Administrator permission can change the channel preferences.`);
    const d = client.global.db.guilds[msg.guild.id];
    if (!args[0]) {
      const embed = new Discord.RichEmbed()
        .setTitle('Current channel preferences and information:')
        .setDescription(`${client.user.username} will send useful messages such as welcome messages, punishments and swear detection notifications into these channels. These are your current channel preferences:`)
        .setColor(client.colors.botGold)
        .setThumbnail(msg.guild.iconURL)
        .setFooter('You can change these preferences by adding some words to this command: "!channels [channel type] [channel]"\nYou can remove channel preferences with "!channels remove [channel type]"');
      for (let i = 0; i < Object.keys(client.global.channelDescs).length; i++) {
        if (i % 2 === 0 && i !== 0) {
          embed.addBlankField(false);
        }
        const channel = d.channels[Object.keys(client.global.channelDescs)[i]];
        embed.addField(Object.keys(client.global.channelDescs)[i] + ':', `${channel ? `Channel set: <#${channel}>.\n` : 'No channel set.\n'}${Object.values(client.global.channelDescs)[i]}`, true);
      }
      msg.channel.send(embed);
    } else if (args[0]) {
      if (args[0] === 'remove') {
        if (!Object.keys(client.global.channelDescs).includes(args[1])) {
          const embed = new Discord.RichEmbed()
            .setTitle('Available channel types:')
            .setDescription(Object.keys(client.global.channelDescs).join('\n'))
            .setColor(client.colors.botGold)
            .setThumbnail(msg.guild.iconURL);
          return msg.channel.send(embed);
        }
        delete client.global.db.guilds[msg.guild.id].channels[args[1]];
        return msg.channel.send(`Sucessfully removed channel preference \`${args[1]}\`.`);
      }
      if (!Object.keys(client.global.channelDescs).includes(args[0])) {
        const embed = new Discord.RichEmbed()
          .setTitle('Available channel types:')
          .setDescription(Object.keys(client.global.channelDescs).join('\n'))
          .setColor(client.colors.botGold)
          .setThumbnail(msg.guild.iconURL);
        return msg.channel.send(embed);
      }
      if (!args[1]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0]);
      if (msg.mentions.channels.size === 0) return msg.channel.send('You need to mention a channel!');
      client.global.db.guilds[msg.guild.id].channels[args[0]] = msg.mentions.channels.first().id;
      msg.channel.send(`Successfully set channel preference \`${args[0]}\` to ${msg.mentions.channels.first()}.`);
    }
  },
};