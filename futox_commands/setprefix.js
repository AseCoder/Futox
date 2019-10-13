module.exports = {
	name: 'setprefix',
	usage: '[new prefix]',
	description: 'Change this server\'s prefix',
	category: 'utility',
	async execute(msg, args, client, Discord) {
    if (!msg.member.roles.has(msg.guild.owner.highestRole.id)) return msg.channel.send(`Only people with the **${msg.guild.owner.highestRole.name}** role can change the prefix.`);
    if (!args[0]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0]);
    if (args[0].length > 25) return msg.channel.send('The prefix must be less than or equal to 25 characters');
    client.global.db.guilds[msg.guild.id].prefix = args[0];
    msg.channel.send(`New prefix set: \`${args[0]}\``);
  },
};