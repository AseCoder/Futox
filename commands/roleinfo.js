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
        let creationDiff = new Date(role.createdTimestamp - role.guild.createdTimestamp);
        let creationDiffStr = '';
        if ((creationDiff.getFullYear() - 1970) > 0) creationDiffStr += (creationDiff.getFullYear() - 1970) + ' years, ';
        if (creationDiff.getMonth() > 0) creationDiffStr += creationDiff.getMonth() + ' months, ';
        if (creationDiff.getDate() > 0) creationDiffStr += creationDiff.getDate() + ' days, ';
        if (creationDiff.getHours() > 0) creationDiffStr += creationDiff.getHours() + ' hours';
        const embed = new Discord.RichEmbed()
            .setTitle(`${role.name} Info:`)
            .setDescription(`ID: ${role.id}\nColor: ${role.hexColor.toUpperCase()}\nCreated: ${role.createdAt}\nRole Holders: ${role.members.size}\nPosition: ${role.calculatedPosition}\nRole - Guild Creation Diff: ${creationDiffStr}`)
            .setColor(role.hexColor)
        msg.channel.send(embed);
    },
};