module.exports = function (str) { 
  return str.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ');
};