module.exports = {
	name: 'specs',
	usage: '',
  description: 'See your own specs (includes many other features)',
  category: 'utility',
	async execute(msg, args, client, Discord) {
        const specArgs = msg.content.toUpperCase().split(' ');
        if (specArgs[2]) {
          if (specArgs[1] === 'REMOVE') {
            const specs = client.global.db.specs;
            if (!specs) {
              const embed = new Discord.RichEmbed()
                .setTitle('You don\'t have any specs.')
                .setColor('#FF0000')
                .setFooter('"' + client.global.db.guilds[msg.guild.id].prefix + 'specs help" for help with usage.')
              return msg.channel.send(embed);
            } 
            specArgs[2] = specArgs.slice(2).join(' ');
            if (!specs[specArgs[2]]) {
              const embed = new Discord.RichEmbed()
                .setTitle('Your list doesn\'t have that spec item.')
                .setColor('#FF0000')
                .setFooter('"' + client.global.db.guilds[msg.guild.id].prefix + 'specs help" for help with usage.')
              return msg.channel.send(embed);
            }
            delete client.global.db.specs[msg.author.id][specArgs[2].toUpperCase()];
            const removedEmbed = new Discord.RichEmbed()
              .setTitle('Successfully Removed Item')
              .setDescription(`${specArgs[2].toUpperCase()}: ${specs[specArgs[2].toUpperCase()]}`)
              .setColor('#FF0000')
              .setFooter('"' + client.global.db.guilds[msg.guild.id].prefix + 'specs help" for help with usage.')
            return msg.channel.send(removedEmbed);
          } else if (specArgs[1] === 'RESET') {
            if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
              let embed = new Discord.RichEmbed()
                .setTitle('Not enough permissions.')
                .setDescription('You need to have the "manage messages" permission to use this command.')
                .setFooter('"' + client.global.db.guilds[msg.guild.id].prefix + 'specs help" for help with usage.')
                .setColor('#ff5100')
              return msg.channel.send(embed);
            }
            if (!specArgs[2]) {
              let embed = new Discord.RichEmbed()
                .setTitle('Incorrect Usage!')
                .setDescription('See `' + client.global.db.guilds[msg.guild.id].prefix + 'specs help`')
                .setColor(client.colors.botGold)
              return msg.channel.send(embed);
            }
            if (!client.funcs.fetchMember(specArgs[2], msg)) {
              let embed = new Discord.RichEmbed()
                .setTitle('Incorrect Usage!')
                .setDescription('See `' + client.global.db.guilds[msg.guild.id].prefix + 'specs help`')
                .setColor(client.colors.botGold)
              return msg.channel.send(embed);
            }
            if (!client.global.db.specs[msg.author.id]) {
              let embed = new Discord.RichEmbed()
                .setTitle('This user has no specs.')
                .setFooter('"' + client.global.db.guilds[msg.guild.id].prefix + 'specs help" for help with usage.')
                .setColor('#ff5100')
              return msg.channel.send(embed);
            }
            delete client.global.db.specs[client.funcs.fetchMember(specArgs[2], msg).user.id];
            let removedEmbed = new Discord.RichEmbed()
              .setTitle('Successfully Removed All Items')
              .setDescription(`All ${client.funcs.fetchMember(specArgs[2], msg).user.tag}'s specs have been removed. No one can see them anymore.`)
              .setColor('#FF0000')
              .setFooter('"' + client.global.db.guilds[msg.guild.id].prefix + 'specs help" for help with usage.')
            return msg.channel.send(removedEmbed);
          }
          if (!msg.content.includes(':')) {
            let embed = new Discord.RichEmbed()
              .setTitle('Incorrect Usage!')
              .setDescription('See `' + client.global.db.guilds[msg.guild.id].prefix + 'specs help`')
              .setColor(client.colors.botGold)
            return msg.channel.send(embed);
          }
          if (specArgs[1].length > 50 || specArgs[2].length > 100) {
            let embed = new Discord.RichEmbed()
              .setTitle('Max length of [component] or [info] reached.')
              .setDescription('We\'ve limited the [component] length to 50 and the [info] to 100 to avoid chat flooding, unintended bot crashes and database storage limits.')
              .setFooter('"' + client.global.db.guilds[msg.guild.id].prefix + 'specs help" for help with usage.')
              .setColor('#ff5100')
            return msg.channel.send(embed);
          }
          function correctCasing(str) {
            let check = ['intel(r)', 'intel', 'ryzen', 'asus', 'razer', 'logitech', 'corsair', 'hyperx', 'hp', 'gb', 'tb', 'ghz', 'hz', 'rgb', 'hd', 'gtx', 'rtx', 'geforce', 'amd', 'ti', 'acer', 'ssd', 'hdd', 'msi'];
            let correct = ['Intel(R)', 'Intel(R)', 'Ryzen', 'Asus', 'Razer', 'Logitech', 'Corsair', 'HyperX', 'HP', 'Gb', 'Tb', 'GHz', 'Hz', 'RGB', 'HD', 'GTX', 'RTX', 'GeForce', 'AMD', 'Ti', 'Acer', 'SSD', 'HDD', 'MSI'];
            let words = str.toLowerCase().split(' ');
            for (let i = 0; i < words.length; i++) {
              for (let j = 0; j < check.length; j++) {
                if (words[i].includes(check[j]) && words[i].length <= check[j].length + 3) {
                  let regex = new RegExp(check[j], 'i');
                  str = str.replace(regex, correct[j]);
                }
              }
            }
            return str;
          }
          let component = {
            name: msg.content.toUpperCase().slice(specArgs[0].length + 1, msg.content.indexOf(':')),
            description: correctCasing(msg.content.slice(msg.content.indexOf(':') + 2)),
          };
          let cleanComponent = `${component.name}: ${component.description}`;
          if (!client.global.db.specs[msg.author.id]) {
            client.global.db.specs[msg.author.id] = {};
            client.global.db.specs[msg.author.id][component.name] = component.description;
            let addedEmbed = new Discord.RichEmbed()
              .setTitle('Successfully Added Item')
              .setDescription(`${cleanComponent}`)
              .setColor('#00FF00')
              .setFooter('"' + client.global.db.guilds[msg.guild.id].prefix + 'specs help" for help with usage.')
            return msg.channel.send(addedEmbed);
          } else {
            let modified = false;
            const specs = client.global.db.specs[msg.author.id];
            if (specs[msg.content.slice(specArgs[0].length + 1, msg.content.indexOf(':')).toUpperCase()]) modified = true;
            if (!modified && Object.keys(specs).length >= 25) {
              const embed = new Discord.RichEmbed()
                .setTitle(`Hmm... It seems like you have reached the limit of 25 spec list items. Try removing some before adding another one.`)
                .setColor('#FF0000')
                .setFooter('"' + client.global.db.guilds[msg.guild.id].prefix + 'specs help" for help with usage.')
              return msg.channel.send(embed);
            }
            client.global.db.specs[msg.author.id][component.name] = component.description;
            if (!modified) {
              let addedEmbed = new Discord.RichEmbed()
                .setTitle('Successfully Added Item')
                .setDescription(`${cleanComponent}`)
                .setColor('#00FF00')
                .setFooter('"' + client.global.db.guilds[msg.guild.id].prefix + 'specs help" for help with usage.')
              return msg.channel.send(addedEmbed);
            } else {
              let editedEmbed = new Discord.RichEmbed()
                .setTitle('Successfully Edited Item')
                .setDescription(`${cleanComponent}`)
                .setColor('#FFFF00')
                .setFooter('"' + client.global.db.guilds[msg.guild.id].prefix + 'specs help" for help with usage.')
              return msg.channel.send(editedEmbed);
            }
          }
        } else if (specArgs[1]) {
          if (specArgs[1] === 'HELP') {
            let embed = new Discord.RichEmbed()
              .setTitle('Specs Help')
              .setDescription('This tool lets all users list their system specifications and other computer related accessories. Do not use this tool to advertise products, other Minecraft servers, social media accounts, other Discord servers or any real life services. This tool may automatically change the spelling and casing of items in your spec list to avoid confusion.​')
              .setColor(client.colors.botGold)
              .addField('**EDITING YOUR SPEC LIST**', '​')
              .addField('Adding or editing an item in your spec list:', '' + client.global.db.guilds[msg.guild.id].prefix + 'specs [component]**:** [info]')
              .addField('Removing an item from your spec list:', '' + client.global.db.guilds[msg.guild.id].prefix + 'specs remove [component]')
              .addField('Clearing a spec list:', '' + client.global.db.guilds[msg.guild.id].prefix + 'specs reset **[User, only available for staff members]**')
              .addField('Examples:', '' + client.global.db.guilds[msg.guild.id].prefix + 'specs cpu: Ryzen 5\n' + client.global.db.guilds[msg.guild.id].prefix + 'specs graphics card: GTX 1070\n' + client.global.db.guilds[msg.guild.id].prefix + 'specs remove cpu\n' + client.global.db.guilds[msg.guild.id].prefix + 'specs reset\n' + client.global.db.guilds[msg.guild.id].prefix + 'specs reset @Rick')
              .addField('**SEEING SPEC LISTS**', '​')
              .addField('Seeing your own spec list:', '' + client.global.db.guilds[msg.guild.id].prefix + 'specs')
              .addField('Seeing someone else\'s spec list:', '' + client.global.db.guilds[msg.guild.id].prefix + 'specs [User]')
              .addField('Examples:', '' + client.global.db.guilds[msg.guild.id].prefix + 'specs Lisa\n' + client.global.db.guilds[msg.guild.id].prefix + 'specs\n' + client.global.db.guilds[msg.guild.id].prefix + 'specs @Bob')
            return msg.channel.send(embed);
          } else if (specArgs[1] === 'RESET') {
            if (!client.global.db.specs[msg.author.id]) {
              const embed = new Discord.RichEmbed()
                .setTitle('You don\'t have any specs.')
                .setColor('#FF0000')
                .setFooter('"' + client.global.db.guilds[msg.guild.id].prefix + 'specs help" for help with usage.')
              return msg.channel.send(embed);
            }
            delete client.global.db.specs[msg.author.id]
            let embed = new Discord.RichEmbed()
              .setTitle('Successfully Removed All Items')
              .setDescription('All your specs have been removed. No one can see them anymore.')
              .setColor('#FF0000')
              .setFooter('"' + client.global.db.guilds[msg.guild.id].prefix + 'specs help" for help with usage.')
            return msg.channel.send(embed);
          } else if (specArgs[1]) {
            let member = client.funcs.fetchMember(specArgs[1], msg);
            if (!member) return msg.channel.send('I could not obtain The User');
            let embed = new Discord.RichEmbed()
              .setTitle(`${member.user.tag} specs:`)
              .setDescription(`These specs are user input and could be false. Use at your own risk.`)
              .setColor(client.colors.botGold)
              .setFooter('"' + client.global.db.guilds[msg.guild.id].prefix + 'specs help" for help with usage.')
            if (!client.global.db.specs[member.user.id]) {
              embed.addField('No specs.', 'No specifications. :neutral_face:');
            } else {
              const specs = client.global.db.specs[member.user.id];
              for (let i = 0; i < Object.keys(specs).length; i++) {
                embed.addField(Object.keys(specs)[i] + ':', Object.values(specs)[i]);
              }
            }
            return msg.channel.send(embed);
          } else {
            let embed = new Discord.RichEmbed()
              .setTitle('Incorrect Usage!')
              .setDescription('See `' + client.global.db.guilds[msg.guild.id].prefix + 'specs help`')
              .setColor(client.colors.botGold)
            return msg.channel.send(embed);
          }
        } else {
          let user = msg.author;
          let embed = new Discord.RichEmbed()
            .setTitle(`${user.tag} specs:`)
            .setDescription(`These specs are user input and could be false. Use at your own risk.`)
            .setColor(client.colors.botGold)
            .setFooter('"' + client.global.db.guilds[msg.guild.id].prefix + 'specs help" for help with usage.')
          if (!client.global.db.specs[msg.author.id]) {
            embed.addField('No specs.', 'No specifications. :neutral_face:');
          } else {
            const specs = client.global.db.specs[msg.author.id];
            for (let i = 0; i < Object.keys(specs).length; i++) {
              embed.addField(Object.keys(specs)[i] + ':', Object.values(specs)[i]);
            }
          }
          return msg.channel.send(embed);
        }
    },
};