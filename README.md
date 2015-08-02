# Evolve: HATEOAS stuff

Given an endpoint, and other limited knowledge about the API create a hypermedia client. This client should be able to evolve independently of the API. 

Over time the API will evolve in a backwards compatible way. Every iteration of the world we'll add new bots.

Powered by Siren.

This is first in a set of implementation experiments with hypermedia.

## Grid system
```
  0 1 2           N
|a            W - | - E
|b                S
|c            
```

## Affordances 

* create-bot
* move-north
* move-south
* move-east
* move-west

## Resources
* /
```
{
  class: ['root'],
  properties: {
    bots: 1
  },
  entities: [
    {
      class: ['bot'],
      rel: ['occupant'],
      href: '/bot/1'
    }
  ],
  actions:[ 
    {
      name: 'create-bot',
      method: 'POST',
      href: '/bot'   
    }
  ],
  links: [
    {
      rel: ['self'],
      href: '/'  
    }
  ]  
}
```

* /map/{x},{y}
```
{
  class: ['tile'],
  properties: {
    x: '1',
    y: 'a'  
  },
  entities: [
    {
      class: ['bot'],
      rel: ['occupant'],
      href: '/bot/1'
    }
  ],
  links: [
    {
      rel: ['self'],
      href: '/map/1,a'  
    }
  ] 
}
```

* /bot/{id}
```
{
  class: ['bot']
  properties: {
    id: 1,
    spacesMoved: 1,
    x: 1,
    y: 'b'    
  },
  actions: [
    {
      name: 'move-north',
      method: 'POST',
      href: '/0,b',
      type: 'application/json',
      fields: [
        {
          name: 'botId',
          type: 'hidden',
          value: 1  
        }
      ]    
    },
    {
      name: 'move-south',
      method: 'POST',
      href: '/2,b',
      type: 'application/json',
      fields: [
        {
          name: 'botId',
          type: 'hidden',
          value: 1  
        }
      ]    
    },
    {
      name: 'move-east',
      method: 'POST',
      href: '/1,c',
      type: 'application/json',
      fields: [
        {
          name: 'botId',
          type: 'hidden',
          value: 1  
        }
      ]    
    },
    {
      name: 'move-west',
      method: 'POST',
      href: '/1,a',
      type: 'application/json',
      fields: [
        {
          name: 'botId',
          type: 'hidden',
          value: 1  
        }
      ]    
    }
  ],
  links: [
    {
      rel: ['self'],
      href: '/bot/1'  
    }
  ] 
}
```

## Clients

1. Access API from root URL
2. Create new bot from only affordance at the root
  * API returns newly created bot on server that will be placed randomly on the map
3. Bot proceeds to crawl around using links on the API.   


