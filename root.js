var Root = module.exports = function(state) {
  this.state = state;  
};

Root.prototype.init = function(config) {
  config
    .path('/')
    .produces('application/vnd.siren+json')
    .get('/', this.root);  
}

Root.prototype.root = function(env, next) {
  var self = this;
  var res = {
    class: ['root'],
    entities: [],
    actions: [
      {
        name: 'create-bot',
        method: 'POST',
        href: env.helpers.url.path('/bot')  
      }
    ],
    links: [
      {
        rel: ['self'],
        href: env.helpers.url.current()  
      }
    ]  
  }
  
  function botToSiren(bot) {
    return {
      class: ['bot'],
      rel: ['occupant'],
      href: env.helpers.url.path('/bot/'+bot.id)   
    } 
  }  

  if(self.state.bots) {
    self.state.bots.forEach(function(bot) {
      res.entities.push(botToSiren(bot));  
    });
  }
  
  env.response.statusCode = 200;
  env.response.body = res;
  next(env);
}
