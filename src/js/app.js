var settings = require('./settings.js');
var namegen = require('./namegen.js');
var names = require('./names.js');
var $ = require('jQuery');
var attachFastClick = require('fastclick');

var $text = $('#generated').find('.text');

attachFastClick(document.body);

$('#generated').click(pickAndChange);
pickAndChange();


function pick() {
  var lang = names[Math.floor(Math.random() * names.length)];
  return lang[Math.floor(Math.random() * lang.length)];
}

function pickAndChange() {
  $text.text(pick());
}
