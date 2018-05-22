require("fs").readdirSync(__dirname).forEach(file => {
    let name = file.split('.')[0];
    exports[name] = require("./" + name);
});
