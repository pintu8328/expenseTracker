const User = require("../models/user");

exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body)
  User.findOne({ where: { email: email } })
    .then(existingUser => {
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      } else {
        User.create({ name, email, password })
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

        if (result.password !== password) {
            return res.status(401).send({
              message: "Invalid password",
            });
          }

  
        return res.status(200).send({
          success: true,
          message: "Login Success",
        });
      })
      .catch((err) => res.send(err));
  };
