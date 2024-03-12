const User = require("../models/user");
const bcryptjs = require("bcryptjs");

const salt = 10;
exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, salt);
  console.log(req.body)
  User.findOne({ where: { email: email } })
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      } else {
        User.create({ name, email, password: hashedPassword })
          .then((result) => {
            return res.send(result);
          })
          .catch((err) => res.send(err));
      }
    })
    .catch(err => {
      console.error("Error checking email:", err);
      res.status(500).json({ message: "Internal server error" });
    });
};

exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    User.findOne({ where: { email: email } })
      .then((result) => {
        if (result == null) {
          return res.status(404).send({
            message: "User not found",
          });
        }

        if (!bcryptjs.compareSync(password, result.dataValues.password)) {
          return res.status(401).send({
            message: "Password is incorrect",
          });
        }

        return res.status(200).send({
          success: true,
          message: "Login Success",
        });
      })
      .catch((err) => res.send(err));
  };
