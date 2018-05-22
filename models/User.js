module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        company: {
            type: DataTypes.STRING,
            allowNull: true
        },
        data: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        freezeTableName: true
    });

    User.associate = (models) => {
        User.models = models;
    };

    return User;
};
