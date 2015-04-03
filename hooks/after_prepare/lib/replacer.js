var fs = require('fs');

function replacer(fileName, opts) {
  var data = fs.readFileSync(fileName, 'utf8');
  opts.forEach(function(elem) {
    data = data.replace(elem.regex, elem.substitution);
  });
  fs.writeFileSync(fileName, data);
}

module.exports = replacer;
