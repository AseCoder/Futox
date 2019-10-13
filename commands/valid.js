module.exports = {
  name: 'valid',
  usage: '[User]',
  description: 'Run the validity test on this user',
  category: 'utility',
  async execute(msg, args, client, Discord) {
    if (!msg.member.hasPermission('MANAGE_MESSAGES', true, true)) return msg.channel.send('You are not allowed to do that!');
    if (!args[0]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0], client);
    let member = client.funcs.fetchMember(args[0], msg);
    if (!member) return msg.channel.send('I could not obtain The User');

    // username check
    const numbers = '0123456789';
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let usernamePercentage = 0;
    const name = member.user.username;
    let numberOfNumbers = 0;
    let numberOfUnknownChars = 0;
    for (let i = 0; i < name.length; i++) {
        if (numbers.includes(name.split('')[i])) {
            numberOfNumbers += 1;
        }
        if (!alphabet.toUpperCase().includes(name.toUpperCase().split('')[i]) && !numbers.includes(name.toUpperCase().split('')[i])) {
            numberOfUnknownChars += 1;
        }
    }
    if (numberOfNumbers > 2) {
        usernamePercentage -= numberOfNumbers * 10;
    }
    if (numberOfUnknownChars > 3) {
        usernamePercentage -= numberOfUnknownChars * 10;
    }
    if (name.length > 10) {
        usernamePercentage -= (name.length - 10) * 4;
    }
    let joinCreate = ((member.joinedTimestamp - member.user.createdTimestamp) > 86400000) ? true : false;
    let avatar = member.user.avatarURL ? true : false;
    let bot = member.user.bot ? true : false;
    let nickname = member.nickname ? true : false;
    let percentage = 0;
    if (joinCreate) percentage += 40;
    if (avatar) percentage += 25;
    if (nickname) percentage += 35;
    percentage -= usernamePercentage;

    let valid;
    let color;
    if (percentage < 0) {
        valid = 'Literally Nonexistant';
        color = '#000000';
    } else if (percentage < 16) {
        valid = 'Almost Impossible';
        color = '#aa0000';
    } else if (percentage < 32) {
        valid = 'Very Unlikely';
        color = '#ff4d07';
    } else if (percentage < 48) {
        valid = 'Unlikely';
        color = '#ef9300';
    } else if (percentage < 64) {
        valid = 'Possible';
        color = '#ffff00';
    } else if (percentage < 76) {
        valid = 'Likely';
        color = '#a2d300';
    } else if (percentage < 92) {
        valid = 'Very Likely';
        color = '#4ecc10';
    } else if (percentage < 101) {
        valid = 'Almost Certain';
        color = '#10a800';
    } else if (percentage > 100) {
        valid = 'Reliably Inevitable';
        color = '#33ff33';
    }

    const embed = new Discord.RichEmbed()
        .setTitle(`Is \`${member.displayName}\` a valid user?`)
        .setDescription(`According to my sources, the possibility of \`${member.displayName}\` being a valid user is **__${valid}__**${bot ? ', but they are a **Bot**' : ''}. They scored **__${percentage.toFixed(1)}%__** on my validity test.`)
        .addField(`Username (${member.user.username}) validity test:`, `Amount of unknown characters in name: **${numberOfUnknownChars}**, -${numberOfUnknownChars * 10}%\nAmount of numbers in name: **${numberOfNumbers}, -${numberOfNumbers * 10}%**\nName Length: **${name.length}**, -${(name.length - 10) * 4}%\nTogether: **${usernamePercentage}%**`)
        .addField(`Has \`${member.displayName}\` created their account 1 (or more) days before joining this server?`, joinCreate + ', 40%')
        .addField(`Does \`${member.displayName}\` have a custom profile picture (avatar)?`, avatar + ', 25%')
        .addField(`Does \`${member.displayName}\` have a custom nickname?`, nickname + ', 35%')
        .setColor(color)
    msg.channel.send(embed);
  },
};
