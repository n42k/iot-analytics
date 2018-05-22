const {
  FrontEndController,
  EventController,
  AuthController,
  UserController
} = require('./controllers')

module.exports = (app) => {
  app.get('/', FrontEndController.index)
  app.post('/api/register', AuthController.register)
  app.post('/api/login', AuthController.login)
  app.get('/api/user/:id', AuthController.verify, UserController.get)
  app.post('/api/data', AuthController.verify, UserController.setData)
  app.post('/api/event/:name', AuthController.verify, EventController.add)
  app.get('/api/events', EventController.get)
  app.get('/api/events/filter', EventController.filter)

  app.get('/users', FrontEndController.users)
  app.get('/users/:id&:username', FrontEndController.user)
  app.get('/speakers', FrontEndController.speakers)
  app.get('/speakers/:id', FrontEndController.speaker)
  app.get('/sessions', FrontEndController.sessions)
  app.get('/sessions/:id', FrontEndController.sessionDetails)

  app.get('/refresh_events', FrontEndController.attachAdmin);
  app.get('/teste', FrontEndController.teste)
}
