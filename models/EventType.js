module.exports = (sequelize, DataTypes) => {
  const EventType = sequelize.define('EventType', {
    name: {
      type: DataTypes.STRING,
      allownull: false
    }
  }, {
    freezeTableName: true
  })

  EventType.associate = (models) => {
    EventType.hasMany(models.Event, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
    EventType.hasMany(models.EventPropertyType, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
  }

  return EventType
}
