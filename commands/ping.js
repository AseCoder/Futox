module.exports = {
	name: 'ping',
	usage: '',
	description: 'See FutoX\'s current ping',
	category: 'info',
	async execute(msg, args, client, Discord) {
    msg.channel.send(`Current Ping: **${client.ping.toFixed(1)} ms**.`)
  },
};