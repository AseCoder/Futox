module.exports = {
	name: 'pinggraph',
	usage: '',
	description: '[IN BETA] Create a graph of latest pings',
	category: 'fun',
  async execute(msg, args, client, Discord) {
    return msg.channel.send('this command is disabled.');
    const npmCanvas = client.npm.canvas;
    const canvas = npmCanvas.createCanvas(900, 400);
    const ctx = canvas.getContext('2d');

    client.global.pings = [98, 98, 98, 98.66666666666667, 99, 99, 99.33333333333333, 99.66666666666667, 99.66666666666667, 99.66666666666667, 99.33333333333333, 102, 102, 104, 104.33333333333333, 102, 102, 101.33333333333333, 101, 101.33333333333333, 101.33333333333333, 101.33333333333333, 102, 102, 101.66666666666667, 40, 50, 60, 70.33333333333333, 103.33333333333333, 104, 104, 103.33333333333333, 101, 101, 100.33333333333333, 99.66666666666667, 99.66666666666667, 250, 200, 103.33333333333333, 104, 104, 100, 107.66666666666667, 107.66666666666667, 106.66666666666667, 108, 100.66666666666667, 100.66666666666667];

    const highest = Math.max(...client.global.pings);
    console.log('highest', highest);
    const average = client.global.pings.reduce((a, b) => a + b, 0) / client.global.pings.length;
    console.log('average', average);
    const multiplier = average / highest - Math.min(...client.global.pings);
    console.log('multiplier', multiplier);
    const pings = client.global.pings.map(x => Math.round(x * multiplier));

    ctx.strokeStyle = '#0af';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, 900, 400);
    ctx.beginPath();
    ctx.moveTo(10, canvas.height - pings[0]);
    for (let i = 1; i < pings.length; i++) {
      ctx.lineTo((i + 1) * 7, canvas.height - pings[i]);
    }
    ctx.stroke();


    const attachment = new Discord.Attachment(canvas.toBuffer(), `unknown.png`);
    msg.channel.send(attachment);
  },
};