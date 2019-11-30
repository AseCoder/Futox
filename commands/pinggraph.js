module.exports = {
	name: 'pinggraph',
	usage: '',
	description: '[IN BETA] Create a graph of latest pings',
	category: 'fun',
  async execute(msg, args, client, Discord) {
    const npmCanvas = client.npm.canvas;
    const canvas = npmCanvas.createCanvas(900, 400);
    const ctx = canvas.getContext('2d');

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
