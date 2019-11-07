module.exports = {
	name: 'roleinfo',
	usage: '[role name]',
  description: 'Get information about this role',
  category: 'info',
	async execute(msg, args, client, Discord) {
        if (!args[0]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0], client);
        const role = client.funcs.searchRole(args.join(' '), msg.guild);
        if (role.toString().startsWith('extCode')) {
          const embed = new Discord.RichEmbed()
            .setTitle('Role could not be found.')
            .setDescription('An error occured while finding the role.')
            .setFooter(role)
            .setColor(client.colors.botGold)
          return msg.channel.send(embed);
        }
        const embed = new Discord.RichEmbed()
            .setTitle(`${role.name} Info:`)
            .setDescription(`:small_orange_diamond: Role ID: ${role.id}\n:small_orange_color: Role Color: ${role.hexColor.toUpperCase()}\n:small_orange_diamond: Role Created: ${client.npm.moment(role.createdAt).format('D.M.Y')}\n:small_orange_diamond: Role Members: ${role.members.size}\n:small_orange_position: Position: ${role.calculatedPosition} (from bottom)`)
            .setColor(role.hexColor)
	    .setFooter('All dates are in EU format.')
        msg.channel.send(embed);
    },
};
