module.exports = {
  run: async (client, Discord, message) => {
    if (!message.guild || (message.author.bot && message.author.id !== "542971464740241419") || (!client.global.core_devs.map(x => x.id).includes(message.author.id) && client.user.id === '626825158145081352')) return;
    const d = client.global.db.guilds[message.guild.id];
    if (d.mutes.find(x => x.id === message.author.id) && d.mutes.find(x => x.id === message.author.id).timestamp > Date.now()) {
      message.delete();
      return message.reply(`you are muted!`).then(m => m.delete(2500));
    } else if (d.mutes.find(x => x.id === message.author.id) && d.mutes.find(x => x.id === message.author.id).timestamp <= Date.now()) {
      d.mutes.splice(d.mutes.indexOf(d.mutes.find(x => x.id === message.author.id)), 1);
    } 
    const args = message.content.split(' ').slice(1);

    if (d.channels.swear_detection && d.swear_detection) {
      let output = client.funcs.handleProfanities(message, false, Discord, client);
      if (output[0] === false && output[1] !== false) {
        if (output[2] === true) {
          client.funcs.sendInbotMessage(message.guild, d.channels.swear_detection, output[4], client);
        } else {
          message.delete();
          message.channel.send(`${message.member}, No swearing!`);
          client.funcs.sendInbotMessage(message.guild, d.channels.swear_detection, output[4], client);
          return;
        }
      }
    }

    // actual commands
    if (message.content.startsWith(client.global.db.guilds[message.guild.id].prefix) || (!message.content.startsWith(client.global.db.guilds[message.guild.id].prefix) && message.mentions.members.first() && message.mentions.members.first().user.id === client.user.id)) {
      let command = '';
      if (message.content.startsWith(client.global.db.guilds[message.guild.id].prefix)) {
        command = message.content.split(' ')[0].slice(client.global.db.guilds[message.guild.id].prefix.length);
      } else {
        command = message.content.split(' ')[1];
        message.mentions.members.delete(client.user.id);
        args.shift();
        message.content = message.content.split(' ').slice(1).join(' ');
      }
      if (client.commands.has(command)) {
        const permissions = message.channel.permissionsFor(client.user);
        if (!permissions.has('EMBED_LINKS')) return message.channel.send('Missing permission: Embed links!');
        const col = message.channel.createMessageCollector(m => m.author.id === client.user.id, {
          time: 3000,
        });
        let emittedError = null;
        try {
          client.commands.get(command).uses++;
          await client.commands.get(command).execute(message, args, client, Discord);
        } catch (error) {
          emittedError = error.toString();
          console.log(error);
          await message.channel.send('An error occured while completing that command. The core developers will fix this as soon as they can.');
          if (!client.global.locally_hosted) errorEmbed(error, message, client, Discord);
        } finally {
          const clientResponses = [];
          col.on('collect', m => clientResponses.push(m.content ? m.content : '[Embed]'));
          col.on('end', () => {
            client.npm.axios.post(client.config.activity_url, {
              command,
              args,
              responses: clientResponses,
              error: emittedError,
              api_key: process.env.API_KEY,
            }).then((res) => {
              console.log(`statusCode: ${res.statusCode}`)
            }).catch((error) => {
              console.log(`- Failed To Send HTTP POST, Error Code ${error.response.status}, Header -`);
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            });
          });
        } 
      }
    }
  },
};

async function errorEmbed(error, message, client, Discord) {
  const errorsChannel = client.channels.get('643110492126314509');
  const embed = new Discord.RichEmbed()
    .setTitle(`FutoX ${error.toString()}`)
    .setDescription(error.stack ? '```\n' + error.stack.replace(/at /g, '\nat ') + '\n```' : '`[No Stack]`')
    .addField('Guild', `${message.guild.name} \`(${message.guild.id})\``)
    .addField('Channel', `#${message.channel.name} \`(${message.channel.id})\``)
    .addField('User', `${message.author.tag} \`(${message.author.id})\``)
    .addField('Message', `${message.content} \`(${message.id})\``)
    .addField(':white_check_mark: Quick Reply', `Respond within 90 seconds.\n\`<c>\` will be replaced with your tag.\nResponding with \`n\` will cancel Quick Reply.`)
    .setColor(client.colors.botGold);
  const errorEmbedMessage = await errorsChannel.send(embed);
  errorsChannel.awaitMessages(m => client.global.core_devs.map(x => x.id).includes(m.author.id), {
    maxMatches: 1,
    time: 90000,
    errors: ['time'],
  }).then(quickReplies => {
    if (quickReplies.size > 0 && quickReplies.first().content.toLowerCase() !== 'n') {
      quickReplies.first().delete(5000);
      message.channel.send('**Reply from FutoX Developer:** ' + quickReplies.first().content.replace(/<c>/g, quickReplies.first().author.tag));
      embed.fields[embed.fields.length - 1].name = ':x: Quick Reply **ANSWERED**';
      errorEmbedMessage.edit(embed);
    } else if (quickReplies.size > 0 && quickReplies.first().content.toLowerCase() === 'n') {
      quickReplies.first().delete(5000);
      embed.fields[embed.fields.length - 1].name = ':x: Quick Reply **DENIED**';
      errorEmbedMessage.edit(embed);
    } 
  }).catch(() => {
    embed.fields[embed.fields.length - 1].name = ':x: Quick Reply **TIMED OUT**';
    errorEmbedMessage.edit(embed);
  });
}