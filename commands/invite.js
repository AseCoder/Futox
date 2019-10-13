module.exports = {
	name: 'invite',
	usage: '',
	description: 'Get the invitation link of FutoX',
	category: 'info',
	async execute(msg, args, client, Discord) {
        const embed = new Discord.RichEmbed()
            .setAuthor(`Invite FutoX to your Discord server!`)
            .setTitle('Click this link.')
            .setURL('https://discordapp.com/api/oauth2/authorize?client_id=485430484424196106&permissions=8&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Foauth2%2Fauthorize%3Fclient_id%3D485430484424196106%26%3Bscope%3Dbot%26%3Bpermissions%3D0&scope=bot')
            .setColor(client.colors.botGold)
            .setThumbnail(client.user.displayAvatarURL);
        msg.channel.send(embed);
    },
};