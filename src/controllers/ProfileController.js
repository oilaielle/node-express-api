const Profile = require("../models/Profile");
const User = require("../models/User");

const validateProfileInput = require("../validations/profiles/profile");
const validateExperienceInput = require("../validations/profiles/experience");
const validateEducationceInput = require("../validations/profiles/education");

exports.get = (req, res, next) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.profile = "There is no profile for this user";
        next({ status: 422, message: errors });
        return;
      }
      res.json(profile);
    })
    .catch(err => next(err));
};

exports.create = (req, res, next) => {
  const { errors, isValid } = validateProfileInput(req.body);

  if (!isValid) {
    next({ status: 422, message: errors });
    return;
  }

  const profileFields = {};
  profileFields.user = req.user.id;

  if (req.body.handle) {
    profileFields.handle = req.body.handle;
  }

  if (req.body.company) {
    profileFields.company = req.body.company;
  }

  if (req.body.website) {
    profileFields.website = req.body.website;
  }

  if (req.body.location) {
    profileFields.location = req.body.location;
  }

  if (req.body.bio) {
    profileFields.bio = req.body.bio;
  }

  if (req.body.status) {
    profileFields.status = req.body.status;
  }

  if (req.body.githubusername) {
    profileFields.githubusername = req.body.githubusername;
  }

  if (typeof req.body.skills !== "undefined") {
    profileFields.skills = req.body.skills.split(",");
  }

  profileFields.social = {};

  if (req.body.youtube) {
    profileFields.social.youtube = req.body.youtube;
  }

  if (req.body.twitter) {
    profileFields.social.twitter = req.body.twitter;
  }

  if (req.body.facebook) {
    profileFields.social.facebook = req.body.facebook;
  }

  if (req.body.linkedin) {
    profileFields.social.linkedin = req.body.linkedin;
  }

  if (req.body.instagram) {
    profileFields.social.instagram = req.body.instagram;
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if (profile) {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )
          .then(p => res.json(p))
          .catch(err => next(err));
      } else {
        Profile.findOne({ handle: profileFields.handle })
          .then(profile => {
            if (profile) {
              errors.handle = "That handle already exists";
              next({ status: 422, message: errors });
              return;
            }

            new Profile(profileFields)
              .save()
              .then(profile => res.json(profile))
              .catch(err => next(err));
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
};

exports.getHandleById = (req, res, next) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.profile = "There is no profile for this user";
        next({ status: 422, message: errors });
        return;
      }
      res.json(profile);
    })
    .catch(err => next(err));
};

exports.getUserByUserId = (req, res, next) => {
  const errors = {};
  Profile.findOne({ user: req.params.userId })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.profile = "There is no profile for this user";
        next({ status: 422, message: errors });
        return;
      }
      res.json(profile);
    })
    .catch(err => {
      errors.profile = "There is no profile for this user";
      next({ status: 422, message: errors });
      return;
    });
};

exports.all = (req, res, next) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.profile = "There are no profiles";
        next({ status: 422, message: errors });
        return;
      }

      res.json(profile);
    })
    .catch(err => {
      errors.profile = "There are no profiles";
      next({ status: 422, message: errors });
      return;
    });
};

exports.createExperience = (req, res, next) => {
  const { errors, isValid } = validateExperienceInput(req.body);

  if (!isValid) {
    next({ status: 422, message: errors });
    return;
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const nexExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      profile.experience.unshift(nexExp);
      profile.save().then(p => res.json(p));
    })
    .catch(err => next(err));
};

exports.createEducation = (req, res, next) => {
  const { errors, isValid } = validateEducationceInput(req.body);

  if (!isValid) {
    next({ status: 422, message: errors });
    return;
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const nexEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      profile.education.unshift(nexEdu);
      profile.save().then(p => res.json(p));
    })
    .catch(err => next(err));
};

exports.deleteExperience = (req, res, next) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.expId);

      profile.experience.splice(removeIndex, 1);
      profile.save().then(p => res.json(p));
    })
    .catch(err => next(err));
};

exports.deleteEducation = (req, res, next) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.eduId);

      profile.education.splice(removeIndex, 1);
      profile.save().then(p => res.json(p));
    })
    .catch(err => next(err));
};

exports.deleteProfile = (req, res, next) => {
  Profile.findOneAndRemove({ user: req.user.id })
    .then(() => {
      User.findOneAndRemove({ _id: req.user.id })
        .then(() => res.json({ success: true }))
        .catch(err => next(err));
    })
    .catch(err => next(err));
};
