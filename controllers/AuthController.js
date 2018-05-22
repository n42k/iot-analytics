const { User } = require('../models')
const config = require('../config/config')

const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
  try {
    let users = await User.findAll({
      where: {
        username: req.body.username
      }
    })

    if(users.length !== 0) {
      res.status(500).send({failure: 'Username already exists!'})
      return
    }

    let salt = await bcrypt.genSaltAsync(8)
    let hash = await bcrypt.hashAsync(req.body.password, salt, null)

    let user = await User.create({
      username: req.body.username,
      password: hash,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      data: req.body.data
    })

    res.status(201).send({success: {id: user.id}})
  } catch(error) {
    res.status(500).send({failure: 'Server error!'})
  }
}

exports.login = async (req, res) => {
  try {
    let users = await User.findAll({
      where: {
        username: req.body.username
      }
    })

    if(users.length !== 1) {
      res.status(500).send({failure: 'Invalid username/password combination!'})
      return
    }

    let [user] = users

    let successful = await bcrypt.compareAsync(req.body.password, user.password)

    if(!successful) {
      res.status(500).send({failure: 'Invalid username/password combination!'})
      return
    }

    user.dataValues.token = jwt.sign({id: user.id}, config.authentication.jwtSecret, {
      expiresIn: config.authentication.expiration
    })

    delete user.dataValues['password']
    delete user.dataValues['company']
    delete user.dataValues['createdAt']
    delete user.dataValues['updatedAt']
    delete user.dataValues['SpeakerId']

    res.status(201).send({success: user})
  } catch(error) {
    res.status(500).send({failure: 'Server error!'})
  }
}

exports.verify = async (req, res, next) => {
  let json
  try {
    json = jwt.verify(req.get('auth'), config.authentication.jwtSecret)
  } catch(error) {
    res.status(500).send({failure: 'Invalid token!'})
  }

  try {
    let users = await User.findAll({
      where: {
        id: json.id
      }
    })

    if(users.length !== 1) {
      res.status(500).send({failure: 'Invalid token!'})
      return
    }

    let [user] = users
    req.user = user

    next()
  } catch(error) {
    res.status(500).send({failure: 'Server error!'})
  }
}
