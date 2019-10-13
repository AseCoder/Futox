module.exports = function (format) {
  return moment(Date.now).format(format);
};