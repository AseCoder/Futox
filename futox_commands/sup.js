module.exports = {
	name: 'sup',
	usage: '',
	description: 'Greet the bot',
	category: 'fun',
	async execute(msg, args, client, Discord) {
		msg.channel.send(`Howdy, **${msg.member.displayName}!**`);
    },
};