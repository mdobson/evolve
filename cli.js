var program = require('commander');
var gjallarhorn = require('gjallarhorn');

var url = program.args[0];

program
  .version('0.0.0')
  .option('--generation -g <gen>', 'Set the generation of the client to be spawned.'); 

program
  .parse(process.argv);

