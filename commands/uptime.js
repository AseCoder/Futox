module.exports = {
	name: 'uptime',
	usage: '',
  description: 'See current bot uptime',
  category: 'info',
  async execute(msg, args, client, Discord) {
    const uptime = client.uptime / 1000 / 60 / 60;
    msg.channel.send(`I've been up & running for **${uptime >= 6 ? Math.round(uptime) : uptime.toFixed(1)}** hours.`);
  },
};