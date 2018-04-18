const Profile = require("../models/Profile");

exports.get = (req, res, next) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        next({ status: 422, message: errors });
        return;
      }
      res.json(profile);
    })
    .catch(err => next(err));
};
