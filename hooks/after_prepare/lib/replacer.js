var fs = require('fs');

function replacer(fileName, opts) {
  try {
    var data = fs.readFileSync(fileName, 'utf8');
    opts.forEach(function (elem) {
      data = data.replace(elem.regex, elem.substitution);
    });
    fs.writeFileSync(fileName, data);
  } catch (ex) {
    console.log('could not read / write file ' + fileName);
    console.log(ex);
  }
}

module.exports = replacer;
