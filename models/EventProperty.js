module.exports = (sequelize, DataTypes) => {
  const EventProperty = sequelize.define('EventProperty', {
    value: {
      type: DataTypes.STRING,
      allownull: false
    }
  }, {
    freezeTableName: true
  })

  EventProperty.associate = (models) => {
    EventProperty.belongsTo(models.EventPropertyType, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
  }

  return EventProperty
}
