module.exports = {
	name: 'lastdbwrite',
	usage: '',
	description: 'Information for core devs to reduce data loss',
	category: 'info',
	async execute(msg, args, client, Discord) {
    if (!client.global.core_devs.map(x => x.id).includes(msg.author.id)) return msg.channel.send(client.global.replies.notAllowed);
    const embed = new Discord.RichEmbed() 
      .setTitle(':gear: FutoX DB Writes')
      .setDescription(`The DB ${client.global.dbwrite.unsavedChanges ? '**has**' : '**doesn\'t have**'} unsaved changes.`)
      .setColor(client.colors.botGold)
      .addField(`:clock${client.npm.moment().format('h')}: Last attempt:`, !client.global.dbwrite.lastAttempt.timestamp ? 'There haven\'t been any attempts yet.' : `Successful: **${client.global.dbwrite.lastAttempt.success}**\nWhen: **${client.npm.moment(client.global.dbwrite.lastAttempt.timestamp).fromNow()} (${Date.now() - client.global.dbwrite.lastAttempt.timestamp} ms)**`)
      .addField(`${client.npm.moment(client.global.dbwrite.nextAttemptTimestamp - Date.now()).minute() < 11 ? ':hourglass:' : ':hourglass_flowing_sand:'} Next attempt:`, `Predicted Successfullness: **${client.global.dbwrite.unsavedChanges}**\nWhen: **in ${client.npm.moment(client.global.dbwrite.nextAttemptTimestamp).toNow(true)} (${client.global.dbwrite.nextAttemptTimestamp - Date.now()} ms)**`)
    msg.channel.send(embed);
  },
};