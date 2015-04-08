var nameGen = (function () {
  var nameGenFromArray = function (names) {
    var name = '', i = 0, l = names.length, part;
    while (i < l) {
      part = names[i][(Math.floor(Math.random() * names[i].length))]
      if (!/^[\.! ?]*$/.test(part)) {
        name += ' ';
      }
      name += part;
      i = i + 1;
    }

    return name;
  };

  var generateFromMultiDimensionalArray = function (dimensions, names) {
    var x = Math.floor(Math.random() * names.length);
    var dims = dimensions - 1;
    if (dims <= 1) {
      return nameGenFromArray(names[x]);
    } else {
      return generateFromMultiDimensionalArray(dims, names[x]);
    }
  };

  var generator = {
    fromArray : nameGenFromArray,
    fromHigherArray : generateFromMultiDimensionalArray
  };

  return generator;
}());

if (typeof module !== 'undefined') {
  module.exports = nameGen;
}
