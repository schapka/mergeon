const path = require('path');
const _ = require('lodash');

module.exports = {
  entry: path.resolve(__dirname, 'data', 'entry.json'),
  mergeCustomizer: function (objValue, srcValue) {
    if (_.isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  },
};
