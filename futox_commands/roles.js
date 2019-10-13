module.exports = {
	name: 'roles',
	usage: '[role type] [role name]',
	description: 'Change this server\'s role preferences',
	category: 'utility',
	async execute(msg, args, client, Discord) {
    if (!msg.member.roles.has(client.global.db.guilds[msg.guild.id].roles.highest_role)) return msg.channel.send(`Only people with the **${msg.guild.roles.get(client.global.db.guilds[msg.guild.id].roles.highest_role).name}** role can change the role preferences.`);
    const d = client.global.db.guilds[msg.guild.id];
    if (!args[0]) {
      const embed = new Discord.RichEmbed()
        .setTitle('Current role preferences and information:')
        .setDescription(`${client.user.username} will use these roles to determine who has access to which commands. These are your current role preferences:`)
        .setColor(client.colors.botGold)
        .setThumbnail(msg.guild.iconURL)
        .setFooter('You can change these preferences by adding some words to this command: "!roles [role type] [role name]"\nYou can remove role preferences with "!roles remove [role type]"');
      for (let i = 0; i < Object.keys(client.global.roleDescs).length; i++) {
        const role = d.roles[Object.keys(client.global.roleDescs)[i]];
        if (typeof role === 'object') {
          embed.addField(Object.keys(client.global.roleDescs)[i] + ':', `${role ? `Roles set: <@&${role.join('>, <@&')}>.\n` : 'No role set.\n'}${Object.values(client.global.roleDescs)[i]}`, true);
         } else {
           embed.addField(Object.keys(client.global.roleDescs)[i] + ':', `${role ? `Role set: <@&${role}>.\n` : 'No role set.\n'}${Object.values(client.global.roleDescs)[i]}`, true);
        }
      }
      msg.channel.send(embed);
    } else if (args[0]) {
      if (args[0] === 'remove') {
        if (!Object.keys(client.global.roleDescs).includes(args[1])) {
          const embed = new Discord.RichEmbed()
            .setTitle('Available role types:')
            .setDescription(Object.keys(client.global.roleDescs).join('\n'))
            .setColor(client.colors.botGold)
            .setThumbnail(msg.guild.iconURL);
          return msg.channel.send(embed);
        }
        delete client.global.db.guilds[msg.guild.id].roles[args[1]];
        return msg.channel.send(`Sucessfully removed role preference \`${args[1]}\`.`);
      } 
      if (!Object.keys(client.global.roleDescs).includes(args[0])) {
        const embed = new Discord.RichEmbed()
          .setTitle('Available role types:')
          .setDescription(Object.keys(client.global.roleDescs).join('\n'))
          .setColor(client.colors.botGold)
          .setThumbnail(msg.guild.iconURL);
        return msg.channel.send(embed);
      }
      if (!args[1]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0]);
      if (args[0] === 'staff_roles') {
        let roleIds = [];
        const roleNames = msg.content.slice(msg.content.indexOf('staff_roles') + 'staff_roles ').replace(/, /g, ',');
        for (let i = 0; i < roleNames.split(',').length; i++) {
          const role = client.funcs.searchRole(roleNames.split(',')[i], msg.guild);
          if (role.toString().startsWith('extCode')) {
            msg.channel.send(`Role with name "${roleNames.split(',')[i]}" does not exist.`);
          } else {
            roleIds[role.calculatedPosition] = role.id;
          }
        }
        roleIds = roleIds.filter(x => x !== null);
        client.global.db.guilds[msg.guild.id].roles.staff_roles = roleIds;
        msg.channel.send(`Successfully set staff roles to ${roleIds.map(x => msg.guild.roles.get(x).name).join(', ')}.`);
      } else {
        const role = client.funcs.searchRole(args.slice(1).join(' '), msg.guild);
        if (role.toString().startsWith('extCode')) return msg.channel.send('You need to give me an existing role name!');
        client.global.db.guilds[msg.guild.id].roles[args[0]] = role.id;
        msg.channel.send(`Successfully set role preference \`${args[0]}\` to ${role.name}.`);
      }
    }
  },
};