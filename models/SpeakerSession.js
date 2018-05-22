module.exports = (sequelize, DataTypes) => {
    const SpeakerSession = sequelize.define('SpeakerSession', {
    }, {
        freezeTableName: true
    });

    SpeakerSession.associate = (models) => {
        SpeakerSession.belongsTo(models.Speaker, { foreignKey: { allowNull: false }, as: 'speaker', onDelete: 'CASCADE' });
        SpeakerSession.belongsTo(models.Session, { foreignKey: { allowNull: false }, as: 'session', onDelete: 'CASCADE' });
        SpeakerSession.models = models;
    };

    return SpeakerSession;
};
