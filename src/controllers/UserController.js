const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const UserResponse = require("../responses/UserResponse");
const validateRegisterInput = require("../validations/users/register");

exports.register = (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    next({ status: 422, message: errors });
    return;
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exsits";
      next({ status: 422, message: errors });
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
            .then(user => res.json(UserResponse.one(user)))
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
      // errors.email = "User email not found";
      next({ status: 422, message: "User email not found" });
      return;
    }

    bcrypt.compare(password, user.password).then(isMathch => {
      if (isMathch) {
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        jwt.sign(
          payload,
          process.env.SECRET_OR_KEY,
          {
            expiresIn: parseInt(process.env.EXPIRES_IN)
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

exports.current = (req, res, next) => {
  res.json(UserResponse.one(req.user));
};
