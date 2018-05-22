module.exports = (sequelize, DataTypes) => {
    const Venue = sequelize.define('Venue', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        }
    }, {
        freezeTableName: true
    });

    Venue.associate = (models) => {
        Venue.models = models;
    };

    return Venue;
};
