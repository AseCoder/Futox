module.exports = function (length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const numbs = '0123456789';
  let output = '';
  for (let i = 0; i < length; i++) {
    const type = Math.floor(Math.random() * 3);
    if (type === 0) {
      const random = Math.floor(Math.random() * chars.length);
      output += chars[random];
    } else if (type === 1) {
      const random = Math.floor(Math.random() * chars.length);
      output += chars[random].toUpperCase();
    } else {
      const random = Math.floor(Math.random() * numbs.length);
      output += numbs[random];
    }
  }
  return output;
};