const _ = require("lodash");

const fileds = ["id", "name", "email"];

exports.one = obj => _.pick(obj, fileds);
exports.all = objs => objs.map(obj => _.pick(obj, fileds));
