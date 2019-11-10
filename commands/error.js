module.exports = {
  name: 'error',
  usage: '',
  description: 'Emit an error',
  category: 'utility',
  async execute(msg, args, client, Discord) {
    if (!client.global.core_devs.map(x => x.id).includes(msg.author.id)) return msg.channel.send(client.global.replies.notAllowed)
    throw new Error();
  },
};