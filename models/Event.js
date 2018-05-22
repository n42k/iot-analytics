module.exports = (sequelize, DataTypes) => {
  let Op = sequelize.Op

  const Event = sequelize.define('Event', {
    name: {
      type: DataTypes.STRING,
      allownull: false
    }
  }, {
    freezeTableName: true
  })

  Event.associate = (models) => {
    Event.belongsTo(models.EventType, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
    Event.hasMany(models.EventProperty, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })

    Event.models = models
  }

  Event.createFromJSON = async (EventTypeId, properties) => {
    let models = Event.models

    return sequelize.transaction(async t => {
      if(!properties.sessionId) {
        let roomId = properties.roomId
        let time = new Date(properties.time)

        let session = await models.Session.findOne({
          where: {
            startTime: {
              [Op.lt]: time
            },
            endTime: {
              [Op.gt]: time
            }
          },
          include: [{
            model: models.Venue,
            where: {
              name: roomId
            },
            as: 'venue'
          }]
        }, {transaction: t})

        if(session === null)
          throw new Error('No session found for beacon event!')

        properties.sessionId = session.id // get sessionId from roomId and time
      }

      let propertyTypes = await models.EventPropertyType.findAll({
        attributes: ['id', 'name'],
        where: { EventTypeId: EventTypeId }
      }, {transaction: t})

      for (let propertyType of propertyTypes) {
        if (!(propertyType.name in properties)) {
          throw new Error('Property not in properties!')
        }
      }

      let event = await Event.create({
        EventTypeId: EventTypeId
      }, {transaction: t})

      for (let propertyType of propertyTypes) {
        await models.EventProperty.create({
          value: properties[propertyType.name],
          EventId: event.id,
          EventPropertyTypeId: propertyType.id
        }, {transaction: t})
      }

      let eventType = await models.EventType.findOne({
        where: {
          id: EventTypeId
        }
      }, {transaction: t})

      if(eventType.name === 'beacon') {
        let events = await Event.filterAll('sessionpresent', {
          userId: properties.userId,
          sessionId: properties.sessionId
        }, t)

        for(let evt of events) {
          if(evt.dataValues.properties.sessionId == properties.sessionId &&
            evt.dataValues.properties.userId == properties.userId)
              return event
        }

        let sessionPresentEventType = await models.EventType.findOne({
          where: {
            name: 'sessionpresent'
          }
        }, {transaction: t})

        await Event.createFromJSON(sessionPresentEventType.id, {
          userId: properties.userId,
          sessionId: properties.sessionId
        })
      }

      return event
    })
  }

  Event.prototype.getJSON = async function() {
    let models = Event.models

    let rows = await models.EventProperty.findAll({
      attributes: ['value'],
      where: { EventId: this.id },
      include: [{
        model: models.EventPropertyType,
        attributes: ['name']
      }]
    })

    var dict = {}

    for (let rowIndex in rows) {
      let row = rows[rowIndex]

      let name = row['EventPropertyType']['name']
      let value = row['value']

      dict[name] = value
    }

    let propertyTypes = await models.EventPropertyType.findAll({
      attributes: ['name'],
      where: { EventTypeId: this.EventTypeId }
    })

    for (let propertyTypeIndex in propertyTypes) {
      let propertyType = propertyTypes[propertyTypeIndex]

      if (!(propertyType.name in dict)) {
        dict[propertyType.name] = ''
      }
    }

    return dict
  }

  Event.filterAll = async (eventName, filters, transaction = null) => {
    let models = Event.models

    let query = `
    SELECT
    	"Event"."id",
    	"Event"."name",
    	"Event"."createdAt",
    	"Event"."updatedAt",
    	"Event"."EventTypeId",
    	"EventProperties"."id" AS "EventProperties.id",
    	"EventProperties"."value" AS "EventProperties.value",
    	"EventProperties->EventPropertyType"."id" AS "EventProperties.EventPropertyType.id",
    	"EventProperties->EventPropertyType"."name" AS "EventProperties.EventPropertyType.name"
    FROM "Event" AS "Event"
    INNER JOIN "EventType"
      ON "Event"."EventTypeId" = "EventType".id
      AND "EventType"."name" = '` + eventName + `'
    LEFT OUTER JOIN "EventProperty" AS "EventProperties"
    	ON "Event"."id" = "EventProperties"."EventId"
    LEFT OUTER JOIN "EventPropertyType" AS "EventProperties->EventPropertyType"
    	ON "EventProperties"."EventPropertyTypeId" = "EventProperties->EventPropertyType"."id"
    `

    let id = 0
    let TABLE_CONST = 'filter'
    for(let filterKey in filters) {
      let filterValue = filters[filterKey]

      let propertyTableName = TABLE_CONST + '_v_' + id
      let propertyTypeTableName = TABLE_CONST + '_k_' + id

      query += '\nINNER JOIN "EventProperty" AS "' + propertyTableName + '"'
      query += '\n  ON "' + propertyTableName + '"."EventId" = "Event"."id"'
      query += '\n  AND "' + propertyTableName + '"."value" = \'' + filterValue + '\''
      query += '\nINNER JOIN "EventPropertyType" AS "' + propertyTypeTableName + '"'
      query += '\n  ON "' + propertyTableName + '"."EventPropertyTypeId" = "' + propertyTypeTableName + '"."id"'
      query += '\n  AND "' + propertyTypeTableName + '"."name" = \'' + filterKey + '\''

      ++id
    }

    query += ';'

    options = {
      transaction: transaction,
      hasJoin: true,
      include: [{
        model: models.EventProperty,
        include: [{
          model: models.EventPropertyType
        }]
      }]
    }

    models.Event._validateIncludedElements(options)

    let events = await sequelize.query(query, options)

    events.forEach(elem => {
      elem.dataValues.properties = {}

      let properties = elem.dataValues.EventProperties

      for(let property of properties)
        elem.dataValues.properties[property.EventPropertyType.name] = property.value

      delete elem.dataValues.EventProperties
    })

    return events
  }

  return Event
}
