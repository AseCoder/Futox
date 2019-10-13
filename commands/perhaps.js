module.exports = {
	name: 'perhaps',
	usage: '',
  description: 'Answer a question with the (probably dead by now) "perhaps" meme',
  category: 'fun',
	async execute(msg, args, client, Discord) {
        msg.delete();
        const embed = new Discord.RichEmbed()
          .setTitle(`${msg.member.displayName} says:`)
          .setImage('https://i.kym-cdn.com/photos/images/original/001/462/400/978.jpg')
          .setColor(client.colors.botGold)
        msg.channel.send(embed);
    },
};