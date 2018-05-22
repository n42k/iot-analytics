module.exports = (sequelize, DataTypes) => {
    const Session = sequelize.define('Session', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        type: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        capacity: {
            type: DataTypes.BIGINT,
            allowNull: true
        }

    }, {
        freezeTableName: true,
    });

    Session.associate = (models) => {
        Session.belongsTo(models.Venue, { foreignKey: { allowNull: false }, as: 'venue', onDelete: 'CASCADE' });
        Session.models = models;
    };

    return Session;
};
