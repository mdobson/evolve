var Map = module.exports = function(state) {
  this.state = state;
}

Map.prototype.init = function(config) {
  config
    .path('/map')
    .consumes('application/json')
    .produces('application/vnd.siren+json')
    .post('/{xy}', this.moveBot)
    .get('/', this.show);
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

Map.prototype.show = function(env, next) {
  var self = this.
  var entity = {
    class: ['map'],
    entities: [],
    actions: [],
    links: [
      {
        rel: ['self'],
        href: env.helpers.url.current()  
      }
    ]  
  };  

  function botToSiren(bot) {
    return {
      class: ['bot'],
      rel: ['occupant'],
      href: env.helpers.url.path('/bot/'+bot.id)   
    } 
  }  

  if(self.state.bots) {
    self.state.bots.forEach(function(bot) {
      entity.entities.push(botToSiren(bot));  
    });
  }

  env.response.statusCode = 200;
  env.response.body = entity;
};

Map.prototype.moveBot = function(env, next) {
  var self = this;
  env.request.getBody(function(err, body) {
    var json = JSON.parse(body.toString());
    var bot = self.state.bots.filter(function(bot) { return bot.id == json.botId  })[0];
    if(bot) {
      var xy = env.route.params.xy.split(',');
      bot.x = parseInt(xy[0]);
      bot.y = parseInt(xy[1]);
      bot.spacesMoved++;
      var entity = generateResponse(bot, self.state, env);
      env.response.statusCode = 200;
      env.response.body = entity;
      next(env);
    } else {
      env.response.statusCode = 404;
      next(env);
    }
  });
}
