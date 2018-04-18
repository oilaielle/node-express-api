const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.register = (req, res, next) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      next({ status: 422, message: "Email already exsits" });
      return;
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) next(err);

          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => next(err));
        });
      });
    }
  });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).then(user => {
    if (!user) {
      next({ status: 422, message: "User email not found" });
      return;
    }

    bcrypt.compare(password, user.password).then(isMathch => {
      if (isMathch) {
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        jwt.sign(
          payload,
          process.env.SECRET_KEY,
          {
            expiresIn: process.env.EXPIRES_IN
          },
          (err, token) => {
            res.json({
              message: "Success",
              token: `Bearer ${token}`
            });
          }
        );
      } else {
        next({ status: 422, message: "Password incorrect" });
        return;
      }
    });
  });
};
