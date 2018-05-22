const { Session } = require('../../models');

module.exports = {

    list() {
        return Session
            .findAll({
                order: [['startTime', 'ASC']],
            })
            .then((session) => {
                return session;
            });
    },
    getById(id) {
        return Session
            .findOne({
                where: {
                    id: id
                }
            });
    }
};

