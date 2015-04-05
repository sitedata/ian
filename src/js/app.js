var settings = require('./settings.js');
var namegen = require('./namegen.js');
var names = require('./texts.json');
var $ = require('jQuery');
var attachFastClick = require('fastclick');

var $text = $('#generated').find('.text');

attachFastClick(document.body);

$('#generated').click(pickAndChange);
pickAndChange();


function pick() {
  var lang = names[Math.floor(Math.random() * names.length)];
  return namegen.fromArray(lang);
}

function pickAndChange() {
  $text.text(pick());
}
