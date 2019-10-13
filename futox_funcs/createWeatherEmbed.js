module.exports = function (result, windType, Discord) {
  windType = (windType === 'k' ? 'km/h' : 'knots')
  let d = new Date();
  let localoffset = -(d.getTimezoneOffset() / 60);
  destoffset = result.location.timezone;
  offset = destoffset - localoffset;
  d = new Date(d.getTime() + offset * 3600 * 1000);
  let color = [0, 0, 0];
  for (let i = 0; i < color.length; i++) {
    if (d.getHours() < 14) {
      color[i] = (d.getHours() - 2) * 15;
    } else {
      color[i] = (24 - (d.getHours() - 2)) * 15;
    }
  }
  color[1] = Math.round(color[0] * 1.2);
  color[2] = Math.round(color[0] * 1.9);
  for (let i = 0; i < color.length; i++) {
    if (color[i] > 255) {
      color[i] = 255;
    }
  }
  let finalColor = '#' + color[0].toString(16) + color[1].toString(16) + color[2].toString(16);
  let embed = new Discord.RichEmbed()
    .setTitle(`Current weather in ${result.location.name}`)
    .setThumbnail(result.current.imageUrl)
    .setColor(finalColor)
    .addField(`${result.current.skytext}, ${result.current.temperature}°${result.location.degreetype}. Wind ${windType === 'km/h' ? parseFloat(result.current.windspeed.split(' ').slice(0, -1)) : Math.round(parseFloat(result.current.windspeed.split(' ').slice(0, -1)) * 0.54)} ${windType} ${result.current.winddisplay.split(' ').slice(2)}.\nTomorrow, ${result.forecast[2].day}: ${Math.round((parseFloat(result.forecast[2].low) + parseFloat(result.forecast[2].high)) / 2)}°${result.location.degreetype}`, '\u200b', true)
    .setFooter(`Observation time ${result.current.day} ${result.current.observationtime} UTC${result.location.timezone >= 0 ? '+' : ''}${result.location.timezone}, ${result.current.date}`)
  return embed;
};