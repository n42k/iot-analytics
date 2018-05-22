module.exports = (sequelize, DataTypes) => {
    const Speaker = sequelize.define('Speaker', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        company: {
            type: DataTypes.STRING,
            allowNull: true
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        website: {
            type: DataTypes.STRING,
            allowNull: true
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        freezeTableName: true
    });

    Speaker.associate = (models) => {
        Speaker.hasOne(models.User, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' });
        Speaker.models = models;
    };

    return Speaker;
};
