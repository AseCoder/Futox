module.exports = {
	name: 'random',
	usage: '[number] [number]',
  description: 'Get a random number between the 2 supplied numbers',
  category: 'fun',
	async execute(msg, args, client, Discord) {
        if (!args[1]) return client.funcs.incorrectUsage(msg.channel, msg.content.split(' ')[0], client);
        let number1 = parseInt(args[0]);
        let number2 = parseInt(args[1]);
        if (number1 === NaN || number2 === NaN) {
          return msg.channel.send('You need to give me **2 numbers**.');
        }
        if (number1 > number2) {
          let temp = number1;
          number1 = number2;
          number2 = temp;
        }
        if (number1 < -2147483647 || number2 > 2147483647) {
          return msg.channel.send('Choose 2 numbers between **-2147483647** and **2147483647**.');
        }
        let final = number1 + Math.round(Math.random() * (number2 - number1));
        msg.channel.send(`:scales: Your random number is **${final}**!`);
    },
};