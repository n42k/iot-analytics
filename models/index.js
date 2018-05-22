const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(module.filename)
const config = require('../config/config').db
const db = {}

let sequelize
if (config.url) {
  sequelize = new Sequelize(config.url, config.options)
} else {
  sequelize = new Sequelize(
    config.database, config.username, config.password, config.options
  )
}

fs
  .readdirSync(__dirname)
  .filter(file =>
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
  .forEach(file => {
    console.log(`Importing: ${file}`)
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    console.log('Associating ' + modelName)
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
