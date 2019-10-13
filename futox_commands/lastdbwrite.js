module.exports = {
	name: 'lastdbwrite',
	usage: '',
	description: 'Information for core devs to reduce data loss',
	category: 'info',
	async execute(msg, args, client, Discord) {
    if (!client.global.core_devs.map(x => x.id).includes(msg.author.id)) return msg.channel.send(client.global.replies.notAllowed);
    if (client.global.lastDBwrite === undefined) return msg.channel.send('There haven\'t been any DB writes yet.');
    msg.channel.send(`The last DB write was ${client.npm.moment(client.global.lastDBwrite).fromNow()} or ${Date.now() - client.global.lastDBwrite}ms ago.`);
  },
};