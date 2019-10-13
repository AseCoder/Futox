module.exports = {
	name: 'weather',
	usage: '[location] [t:f for fahrenheit] [w:n for knots]',
  description: 'Get information about weather in the current location',
  category: 'fun',
  cooldown: 30000,
	async execute(msg, args, client, Discord) {
        if (!args[0]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0], client);
        let degreeType = 'C';
        if (msg.content.includes('t:')) {
          degreeType = msg.content.slice(msg.content.indexOf('t:') + 2, msg.content.indexOf('t:') + 3).toUpperCase();
          args = args.filter(function (value, index, arr) {
            return !value.startsWith('t:');
          });
          if (degreeType !== 'F' && degreeType !== 'C') return msg.channel.send('Use C or F.');
        }
        let windType = 'k';
        if (msg.content.includes('w:')) {
          windType = msg.content.slice(msg.content.indexOf('w:') + 2, msg.content.indexOf('w:') + 3);
          args = args.filter(function (value, index, arr) {
            return !value.startsWith('w:');
          });
          if (windType !== 'k' && windType !== 'n') return msg.channel.send('Use k for km/h or n for knots.');
        }
    
        client.npm.weather.find({ search: args.join(' '), degreeType: degreeType }, function (err, result) {
          if (result === undefined || result.length === 0) return msg.channel.send('Location not found.');
          for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < result.length; j++) {
              if (result[i].location.name === result[j].location.name && i !== j) result.splice(i, 1);
            }
          }
          if (result.length > 1) {
            let options = result.map(x => x.location.name)
            options = options.sort();
            let embed = new Discord.RichEmbed()
              .setTitle('Choose location:')
              .setColor(client.colors.botGold)
              .setFooter(`Respond with a number between 1 and ${options.length}. Type "CANCEL" to cancel.`)
            for (let i = 0; i < options.length; i++) {
              embed.addField(`${i + 1}: ${options[i]}`, '\u200b');
            }
            msg.channel.send(embed);
            const filter = m => m.author.id === msg.author.id;
            const collector = msg.channel.createMessageCollector(filter, { time: 30000 });
    
            collector.on('collect', m => {
              if (m.content.toUpperCase() === 'CANCEL') return collector.stop();
              let number = parseInt(m.content);
              if (Number.isNaN(number) || number < 1 || number > options.length) return msg.channel.send(`Respond with a number between 1 and ${options.length}`);
              for (let i = 0; i < result.length; i++) {
                if (result[0] && result[i].location.name === options[number - 1]) {
                  result = result[i];
                }
              }
              msg.channel.send(client.funcs.createWeatherEmbed(result, windType, Discord));
              collector.stop();
            });
    
            collector.on('end', collected => {
              return collected.size === 0 ? msg.channel.send('Ending location selection.') : null;
            });
          } else {
            result = result[0];
            msg.channel.send(client.funcs.createWeatherEmbed(result, windType, Discord));
          }
        });
    },
};