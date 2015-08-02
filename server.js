var argo = require('argo');
var resource = require('argo-resource');
var titan = require('titan');
var Root = require('./root');
var Bot = require('./bot');
var Map = require('./map');
var state = {};

var coords = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
state.bots = [];
state.map = {};
state.map.xcoords = coords;
state.map.ycoords = coords;

argo()
  .use(titan)
  .add(Root, state)
  .add(Bot, state)
  .add(Map, state)
  .listen(1337);


