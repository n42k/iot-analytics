module.exports = (sequelize, DataTypes) => {
  const EventPropertyType = sequelize.define('EventPropertyType', {
    name: {
      type: DataTypes.STRING,
      allownull: false
    }
  }, {
    freezeTableName: true
  })

  EventPropertyType.associate = (models) => {
    EventPropertyType.hasMany(models.EventProperty, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
    EventPropertyType.belongsTo(models.EventType, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
  }

  return EventPropertyType
}
