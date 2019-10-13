module.exports = function (key, msg) {
  let member = msg.mentions.members.first();
  if (!member) member = msg.guild.members.find(x => x.user.tag.toUpperCase().includes(key.toUpperCase()));
  if (!member) member = msg.guild.members.find(x => x.displayName.toUpperCase().includes(key.toUpperCase()));
  if (!member) member = msg.guild.members.find(x => x.user.id.includes(key));
  if (!member) member = false;
  return member;
};