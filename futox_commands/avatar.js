module.exports = {
	name: 'avatar',
	usage: '[User]',
    description: 'Get a link to this user\'s avatar',
    category: 'info',
	async execute(msg, args, client, Discord) {
        if (!args[0]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0]);
        let member = client.funcs.fetchMember(args[0], msg);
        if (!member) return msg.channel.send(client.global.replies.noMember);
        const embed = new Discord.RichEmbed()
            .setTitle(`Avatar of **${member.user.tag}**:`)
            .setImage(member.user.displayAvatarURL)
            .setFooter(member.user.displayAvatarURL)
            .setColor(client.colors.botGold)
        msg.channel.send(embed);    
    },
};