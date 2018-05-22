const { Event, EventType, EventPropertyType } = require('../models');

exports.add = async (req, res) => {
  try {
    let name = req.params.name

    let eventTypes = await EventType.findAll({
      where: {
        name: name
      }
    })

    if(eventTypes.length !== 1)
      throw new Error('Number of events with name "' + name + '" is not 1.')

    let [eventType] = eventTypes

    let userIdPropertyType = await EventPropertyType.findAll({
      where: {
        name: 'userId',
        EventTypeId: eventType.id
      }
    })

    // append userId to request if event type has userId field
    if(userIdPropertyType.length === 1)
      req.body.userId = '' + req.user.id

    await Event.createFromJSON(eventType.id, req.body)

    res.status(201).send({success: "Event handled!"})
  } catch(error) {
    res.status(500).send({failure: 'Error: ' + error.message})
  }
}

exports.get = async (req, res) => {
  try {
    let events = await Event.findAll({
      attributes: ['id', 'EventTypeId']
    })

    for(let event of events) {
      event.dataValues.properties = await event.getJSON()
    }

    res.status(201).send({success: events})
  } catch (error) {
    res.status(500).send({failure: 'Error getting events'})
  }
}

exports.filter = async (req, res) => {
  try {
    let events = await Event.filterAll('sessionpresent', {
      sessionId: 1
    })

    res.status(201).send({success: events})
  } catch(error) {
    res.status(500).send({failure: 'Error getting events'})
  }
}
