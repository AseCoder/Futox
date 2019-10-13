module.exports = {
	name: 'modmail',
	usage: '[message]',
  description: 'Send a message to representative staff members',
  category: 'utility',
  cooldown: 900,
	async execute(msg, args, client, Discord) {
    if (!args[0]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0], client);
    const d = client.global.db.guilds[msg.guild.id];
    if (!d.channels.modmail) return msg.channel.send('This server does not have a `modmail` channel. Modmail is inactive.');
    const mailchannel = msg.guild.channels.get(d.channels.modmail)
    if (args.join(' ').length > 1024) return msg.channel.send('That message is too long!');
    let roleMention = [];
    if (d.roles.moderator) roleMention.push(msg.guild.roles.get(d.roles.moderator));
    if (d.roles.highest_role) roleMention.push(msg.guild.roles.get(d.roles.highest_role));
    const embed = new Discord.RichEmbed()
      .setTitle(`Modmail by ${msg.member.displayName} (${msg.author.tag}, ${msg.author.id}):`)
      .setDescription(`By ${msg.member}`)
      .addField('Message:', args.join(' '))
      .setThumbnail(msg.author.displayAvatarURL)
      .setColor(`${roleMention[0].hexColor}`);
    await mailchannel.send(roleMention.join(' '));
    await mailchannel.send(embed);
    msg.channel.send(`Modmail sent!`).then(message => message.delete(10000));
  },
};