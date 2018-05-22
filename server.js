require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {sequelize} = require('./models');
const initializeDB = require('./initializedb');
const logger = require('./config/logger.js');
const config = require('./config/config')

const app = express();
app.use(bodyParser.json());
app.use(cors());

if(process.env.FOREST_ENV_SECRET && process.env.FOREST_AUTH_SECRET)
  app.use(require('forest-express-sequelize').init({
    modelsDir: __dirname + '/models',
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    sequelize: require('./models').sequelize
  }));

require('./rest')(app, sequelize);

app.set('view engine', 'ejs');

require('./routes')(app);

app.use('/static',express.static(__dirname + '/static'));

sequelize.sync()
  .then(() => {
    app.listen(config.port, () => logger.info('iot-analytics started listening on port ' + config.port + '!'))
  });
