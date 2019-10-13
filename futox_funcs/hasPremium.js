module.exports = function (user) { 
  let p = 3;
  if (user.discriminator.includes('00')) p += 55;
  if (user.discriminator.includes('000')) p += 80;
  if (user.discriminator.startsWith('000')) p += 95;
  if (user.displayAvatarURL.endsWith('.gif')) p += 90;
  return p;
};