var request = require('request');

var Bot = function(url) {
  this.url = url; 
  this.properties = {};
  this.actions = [];
}

var createBotAction = 'create-bot';
var crawlActions = ['move-north', 'move-south', 'move-west', 'move-east'];

Bot.prototype.create = function(cb) {
  var self = this;
  request(self.url, function(error, response, body) {
    if(!error && response.statusCode == 200) {
      var jsonBody = JSON.parse(body);
      var action = jsonBody.actions.filter(function(a){ return a.name == createBotAction; })[0];
      request({method: action.method, uri: action.href}, function(error, response, body) {
        if(!error && response.statusCode >= 200 && response.statusCode <= 299) {
          var jsonBot = JSON.parse(body);
          self.properties = jsonBot.properties;
          self.actions = jsonBot.actions;
          cb();
        } else {
          cb(err);
          console.log('Error creating bot')
        }
      }); 
    } else {
      cb(err);
      console.log('Error retrieving endpoint.');  
    }
  });
};

Bot.prototype.crawl = function() {
  var self = this;
  if(this.actions.length) {
    var random = Math.floor(Math.random() * this.actions.length);
    var action = this.actions[random];
    var form = {};
    action.fields.forEach(function(field) {
      if(field.type == 'hidden') {
        form[field.name] = field.value;
      }
    });  
    
    var opts = {
      method: action.method,
      uri: action.href,
      json:true,
      body: form
    }

    request(opts, function(error, response, body) {
      if(!error && response.statusCode >= 200 && response.statusCode <= 299) {
        self.properties = body.properties;
        self.actions = body.actions;
      } else {
        console.log('Transition failed.');  
      }
    });
  }
};

var b = new Bot('http://localhost:1337');
b.create(function(e) {
  if(!e) {
    setInterval(function() {
      b.crawl();
    }, 1000);
  }
});
