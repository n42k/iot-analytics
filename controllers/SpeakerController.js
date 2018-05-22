const { Speaker } = require('../models');

module.exports = {

    findByName(name) {
        return Speaker
            .findOne({
                where: {name: name}
            })
    }
};
