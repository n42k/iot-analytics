const { Speaker } = require('../../models');

module.exports = {

    list() {
        return Speaker
            .findAll({
                order: [['createdAt', 'DESC']],
            })
            .then((speaker) => {
                return speaker;
            });
    },
    getById(id) {
        return Speaker
            .findAll({
                where: {
                    id: id
                }
            });
    }
};

