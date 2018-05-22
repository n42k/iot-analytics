const { User } = require('../models')

exports.get = async (req, res) => {
  try {
    let users = await User.findAll({
      where: {
        id: req.params.id
      }
    })

    if(users.length !== 1) {
      res.status(500).send({failure: 'Invalid user id!'})
      return
    }

    let [user] = users

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

exports.setData = async (req, res) => {
  try {
    req.user.data = req.body['data']
    await req.user.save()

    res.status(201).send({success: 'Successfully updated data!'})
  } catch(error) {
    res.status(500).send({failure: 'Server error!'})
  }
}
