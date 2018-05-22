module.exports = {
  port: process.env.PORT || 8888,
  db: {
    username: process.env.DB_USERNAME || 'iot',
    password: process.env.DB_PASSWORD || '123123',
    database: process.env.DB_NAME || 'postgres',
    url: process.env.DB_URL,
    options: {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'postgres',
      operatorsAliases: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      logging: false
    }
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'internetofthings',
    expiration: process.env.JWT_EXPIRE || 60 * 60 * 24 * 365,
  }
}
