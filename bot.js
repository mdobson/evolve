var Bot = module.exports = function(state) {
  this.state = state;
}

function generateResponse(bot, state, env) {
  var entity = {
    class: ['bot'],
    properties: bot,
    actions: [],
    links: [ 
      {
        rel: ['self'],
        href: env.helpers.url.path('/bot/' + bot.id)
      }
    ]  
  }

  var actionField = [{
    name: 'botId',
    type: 'hidden',
    value: 1 
  }]

  if(bot.x != 0) {
    entity.actions.push(
      {
        name: 'move-west',
        href: env.helpers.url.path('/map/'+(bot.x - 1)+','+bot.y),
        method: 'POST',
        type: 'application/json',
        fields: actionField
      }
    );
  }
  
  if(bot.x != state.map.xcoords.length - 1) {
    entity.actions.push(
      {
        name: 'move-east',
        href: env.helpers.url.path('/map/'+(bot.x + 1)+','+bot.y),
        method: 'POST',
        type: 'application/json',
        fields: actionField
      }
    );
  }

  if(bot.y != 0) {
    entity.actions.push(
      {
        name: 'move-north',
        href: env.helpers.url.path('/map/'+bot.x +','+(bot.y + 1)),
        method: 'POST',
        type: 'application/json',
        fields: actionField
      }
    );
  }
  
  if(bot.y != state.map.ycoords.length - 1) {
    entity.actions.push(
      {
        name: 'move-south',
        href: env.helpers.url.path('/map/'+bot.x +','+(bot.y - 1)),
        method: 'POST',
        type: 'application/json',
        fields: actionField
      }
    );
  }

  return entity;
}

Bot.prototype.init = function(config) {
  config
    .path('/bot')
    .produces('application/vnd.siren+json')
    .consumes('application/json')
    .post('/', this.create)
    .get('/{id}', this.show);
};

Bot.prototype.show = function(env, next) {
  var id = env.route.params.id;  
  var bot = this.state.bots.filter(function(bot) {
    return bot.id == id;  
  })[0];
  var entity = generateResponse(bot, this.state, env);
  env.response.statusCode = 200;
  env.response.body = entity;
  next(env);
};

Bot.prototype.create = function(env, next) {
  function randomPoint(map, bots) {
    var flag = false;
    var coords = null;
    while(!flag) {
      var x = Math.floor(Math.random() * map.xcoords.length);  
      var y = Math.floor(Math.random() * map.ycoords.length);
      
      var xcoord = map.xcoords[x];
      var ycoord = map.ycoords[y];
      
      bots.forEach(function(bot) {
        if(bot.x != xcoord && bot.y != ycoord) {
          flag = true;
        }
      });

      if(!bots.length) {
        flag = true;
      }
      coords = {x: xcoord, y: ycoord}; 
    }
    
    return coords;
  }

  var point = randomPoint(this.state.map, this.state.bots);
  var id = this.state.bots.length + 1;

  var bot = {
    x: point.x,
    y: point.y,
    id: id,
    spacesMoved: 0
  };

  this.state.bots.push(bot);
  var entity = generateResponse(bot, this.state, env);
  env.response.statusCode = 201;
  env.response.body = entity;
  next(env);
};


