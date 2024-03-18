const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const ForgotPasswordRequests = require("../models/password");



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

function generateToken(id, name) {
  const secretKey = "pintu"; 
  return jwt.sign({ id, name }, secretKey);
}

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
          token: generateToken(
            result.dataValues.id,
            result.dataValues.name,
            result.dataValues.premium
          )
        });
      })
      .catch((err) => res.send(err));
  };

  exports.sendEmail = async (req, res) => {
    const { email } = req.body;
    console.log(email)
    try {
      const user = await User.findOne({ where: { email:email } });
      if (!user) {
        return res.status(404).json({
          message: "This Email is not registered",
        });
      }
  
      //SIB Message Setup
  
      var defaultClient = SibApiV3Sdk.ApiClient.instance;
  
      var apiKey = defaultClient.authentications["api-key"];
     apiKey.apiKey = process.env.SENDINBLUE;
  
      var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  
      var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  
      const sender = {
        email: "pintu@gmail.com",
      };
  
      sendSmtpEmail = {
        sender,
        to: [
          {
            email: email,
          },
        ],
        subject: "Reset password link",
        textContent: "Reset your password",
      };
  
  
      const id = uuidv4();
      ForgotPasswordRequests.create({
        id,
        userId: user.dataValues.id,
      })
        .then((response) => {
          console.log(response);
          apiInstance
            .sendTransacEmail({
              sender,
              to: [
                {
                  email: email,
                },
              ],
              subject: "Reset password link",
              textContent: `Click to the link to reset your password : http://127.0.0.1:5500/frontend/forgot/resetPassword.html/${id}`,
            })
            .then((result) => {
              res.status(200).json(result);
            })
            .catch((err) => {
              console.log(err);
              return res.status(401).json(err);
            });
        })
        .catch((err) => {
          console.log(err);
          return res.status(401).json(err);
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };


  exports.resetPassword = async (req, res) => {
    const userId = req.params.id;
    const { password } = req.body;
    const salt = 10;
    await ForgotPasswordRequests.findOne({ where: { id: userId } })
      .then((result) => {
        if (!result)
          return res.status(401).json({
            message: "User Not Found",
          });
        if (!result.dataValues.isActive) {
          return res.status(401).json({
            message: "Link is expired",
          });
        }
        const hashedPassword = bcryptjs.hashSync(password, salt);
        User.update(
          {
            password: hashedPassword,
          },
          { where: { id: result.userId } }
        )
          .then((result) => {
            ForgotPasswordRequests.update(
              {
                isActive: false,
              },
              {
                where: {
                  id: userId,
                },
              }
            )
              .then((result) => {
                res.status(201).json(result);
              })
              .catch(console.log);
          })
          .catch(console.log);
      })
      .catch(console.log);
  };
