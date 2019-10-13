module.exports = {
	name: 'today',
	usage: '[utc +/- ?]',
  description: 'Get information about this day because you are too bored to look at your phone\'s calendar',
  category: 'fun',
	async execute(msg, args, client, Discord) {
        let timezone = parseFloat(args[0]);
        if (timezone === NaN) timezone = false;
        let d = new Date();
        let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        let localoffset = -(d.getTimezoneOffset() / 60);
        let destoffset;
        let offset;
        if (args[0] && !timezone && timezone !== 0) return msg.channel.send('Enter a **number**.');
        if (timezone || timezone === 0) {
            if (timezone < -10000 || timezone > 10000) {
                return msg.channel.send('┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻ **You Madman.**');
            }
            if (timezone < -200 || timezone > 200) return msg.channel.send('(╯°□°）╯︵ ┻━┻ **i said between -24 and 24**');
            if (timezone < -24 || timezone > 24) return msg.channel.send('Enter a number between -24 and 24.');
            destoffset = timezone;
            offset = destoffset - localoffset;
            d = new Date(d.getTime() + offset * 3600 * 1000);
        }
        let color = [0, 0, 0];
        for (let i = 0; i < color.length; i++) {
            if ((d.getHours() + (d.getMinutes() / 60)) < 14) {
                color[i] = ((d.getHours() + (d.getMinutes() / 60)) - 2) * 15;
            } else {
                color[i] = (24 - ((d.getHours() + (d.getMinutes() / 60)) - 2)) * 15;
            }
        }
        color[0] = Math.round(color[0]);
        color[1] = Math.round(color[0] * 1.2);
        color[2] = Math.round(color[0] * 1.9);
        for (let i = 0; i < color.length; i++) {
            if (color[i] > 255) {
                color[i] = 255;
            }
        }
        let finalColor = '#' + color[0].toString(16) + color[1].toString(16) + color[2].toString(16);
        const embed = new Discord.RichEmbed()
        .setTitle(`Today is ${days[d.getDay() - 1]}, ${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()} ${d.getHours()}:${d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()} UTC${timezone || timezone === 0 ? (destoffset < 0 ? destoffset : '+' + destoffset) : (localoffset < 0 ? localoffset : '+' + localoffset)}`)
        .addField(':flag_us: Format:', `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()} ${d.getHours() > 12 ? d.getHours() - 12 : d.getHours()}:${d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()} ${d.getHours() < 12 ? 'AM' : 'PM'} UTC${timezone || timezone === 0 ? (destoffset < 0 ? destoffset : '+' + destoffset) : (localoffset < 0 ? localoffset : '+' + localoffset)}`)
        .setColor(finalColor)
        msg.channel.send(embed);
    },
};