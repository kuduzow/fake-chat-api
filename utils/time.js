const dayjs = require('dayjs');

module.exports.haveManySecondsHavePassed = (date) => {
  return dayjs().diff(date, 's');
}
