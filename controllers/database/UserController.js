const { User } = require('../../models');

module.exports = {

    list() {
        return User
            .findAll({
                order: [['createdAt', 'DESC']],
            })
            .then((user) => {
                return user;
            });
    },
    getById(id) {
        return User
            .findOne({
                where: {
                    id: id
                }
            });
    }
};

