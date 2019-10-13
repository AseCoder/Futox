module.exports = {
	name: 'uptime',
	usage: '',
    description: 'See current bot uptime',
    category: 'info',
	async execute(msg, args, client, Discord) {
        let rawUptime = client.uptime;
        let uptime = {};
        uptime['d'] = rawUptime / 86400000;
        uptime['h'] = rawUptime / 3600000;
        uptime['m'] = rawUptime / 60000;
        let finalUptime;
        if (uptime.d < 1) {
            finalUptime = `${Math.round(uptime.h * 10) / 10} hours`;
        } else {
            finalUptime = `${Math.round(uptime.d * 10) / 10} days`;
        }
        msg.channel.send(`I've been up & running for **${finalUptime}.**`);
    },
};