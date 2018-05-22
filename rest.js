const {
  Event,
  EventType,
  EventProperty,
  EventPropertyType
} = require('./models');

const finale = require('finale-rest');

module.exports = function(app, db) {
  finale.initialize({
    app: app,
    sequelize: db
  });

  finale.resource({
    model: Event,
    endpoints: ['/api2/events', '/api2/event/:id']
  })

  finale.resource({
    model: EventType,
    endpoints: ['/api2/eventtypes', '/api2/eventtype/:id']
  })

  finale.resource({
    model: EventProperty,
    endpoints: ['/api2/eventproperties', '/api2/eventproperty/:id']
  })

  finale.resource({
    model: EventPropertyType,
    endpoints: ['/api2/eventpropertytypes', '/api2/eventpropertytype/:id']
  })
};
