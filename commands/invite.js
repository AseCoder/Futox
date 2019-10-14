module.exports = {
	name: 'invite',
	usage: '',
	description: 'Get the invitation link of FutoX',
	category: 'info',
	async execute(msg, args, client, Discord) {
    const embed = new Discord.RichEmbed()
      .setTitle('Invite FutoX to your Discord server!')
      .setDescription(`Add FutoX By Clicking [This Link](${await client.generateInvite(['ADMINISTRATOR'])}).`)
      .setColor(client.colors.botGold)
      .setThumbnail(client.user.displayAvatarURL);
    msg.channel.send(embed);
  },
};