module.exports = {
  name: 'eval',
  usage: '[javascript code]',
  description: 'Evaluation command\nRequirements for eval to work:\n- there is a core dev in this server\n- message sender has server owner\'s highest role\n- 1 or more core devs in this server are online',
  category: 'utility',
  async execute(msg, args, client, Discord) {
    if (msg.guild.members.some(x => client.global.core_devs.map(x => x.id).includes(x.user.id))) { // if guild has core devs
      console.log(true);
      if ((msg.guild.owner && msg.member.roles.has(msg.guild.owner.highestRole.id)) || client.global.core_devs.map(x => x.id).includes(msg.author.id)) { // if msg member has owner's highest role OR msg author is core dev
        console.log(true);
        if (msg.guild.members.filter(x => client.global.core_devs.map(x => x.id).includes(x.user.id) && x.user.presence.status === 'online').size > 0 || client.global.core_devs.map(x => x.id).includes(msg.author.id)) { // if 1 or more core devs in this guild are online OR author is core dev
          console.log('Verified to use eval');
        } else { // no core devs in this server are online
          console.log(false);
          return msg.channel.send(client.global.replies.notAllowed);
        }
      } else { // msg member doesnt have owner's highest role
        console.log(false); 
        return msg.channel.send(client.global.replies.notAllowed);
      }
    } else { // guild does not have core devs
      console.log(false);
      return msg.channel.send(client.global.replies.notAllowed);
    }
    const input = args.join(' ');
    let output;
    let embed = new Discord.RichEmbed()
      .setTitle('Evaluation Command')
      .setColor(client.colors.botGold)
      .setDescription('Hmm... I won\'t let you do that due to reasons.');
    if (!input) return msg.channel.send('You know, this won\'t get either of us anywhere');
    if (!client.global.core_devs.map(x => x.id).includes(msg.author.id)) {
      const fatalInputs = ['MSG', 'ARGS', 'CLIENT', 'DISCORD', 'MODULE', 'PROCESS', 'WHILE', 'REQUIRE', 'EMBED', 'EVAL'];
      for (const fatal of fatalInputs) {
        if (input.toUpperCase().includes(fatal) && fatal !== undefined) {
          return msg.channel.send(embed);
        }
      }
    }
    try {
      output = await eval(input);
    } catch (error) {
      output = error.toString();
      embed.setColor('#FF0000');
    }
    if (!client.global.core_devs.map(x => x.id).includes(msg.author.id)) {
      const fatalOutputs = [process.env.FUTOX_TOKEN, process.env.MUSIX_TOKEN, process.env.API_KEY, client.token];
      for (const fatal of fatalOutputs) {
        if (`${output}`.includes(fatal) && fatal !== undefined) {
          return msg.channel.send(embed);
        }
      }
    }
    if (typeof output === 'object') {
      try {
        output = '(JSON):\n' + JSON.stringify(output);
      } catch (error) {
        output = '(Circular Structure)\n' + output;
      }
    }
    const description = `Input: \`\`\`js\n${input.replace(/; /g, ';').replace(/;/g, ';\n').replace(/\n/g, '\n')}\n\`\`\`\nOutput: \`\`\`\n${output}\n\`\`\``;
    embed.setDescription(description.slice(0, 2048));
    msg.channel.send(embed);
  },
};