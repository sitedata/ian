var settings = require('./settings.js');
var nameGen = require('./namegen.js');
var names = require('./texts.json');
var $ = require('jQuery');
require('jQuery-fittext');
var attachFastClick = require('fastclick');
var $text = $('#generated').find('.text');

attachFastClick(document.body);

var $generated = $('#generated');
$generated.fitText(1.5, {
  minFontSize: 15,
  maxFontSize: 40
});

$generated.click(pickAndChange);
pickAndChange();


function pick() {
  var lang = names[Math.floor(Math.random() * names.length)];
  return nameGen.fromArray(lang);
}

function pickAndChange() {
  $text.text(pick());
}
