const User = require("../models/user");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const ForgotPasswordRequests = require("../models/ForgotPasswordRequests");
const { v4: uuidv4 } = require("uuid");
const bcryptjs = require("bcryptjs");

// exports.sendOTP = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(404).json({
//         message: "This Email is not registered",
//       });
//     }

//     //SIB Message Setup

//     var defaultClient = SibApiV3Sdk.ApiClient.instance;

//     var apiKey = defaultClient.authentications["api-key"];
//     apiKey.apiKey = process.env.EMAIL_API_KEY;

//     var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

//     var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

//     const sender = {
//       email: "heerjnv@gmail.com",
//     };

//     sendSmtpEmail = {
//       sender,
//       to: [
//         {
//           email: email,
//         },
//       ],
//       subject: "OTP Verification",
//       textContent: "1234 is your OTP",
//     };

//     //Save Data into the ForgotPassword Table

//     const id = uuidv4();
//     ForgotPasswordRequests.create({
//       id,
//       userId: user.dataValues.id,
//     })
//       .then((response) => {
//         console.log(response);
//         apiInstance
//           .sendTransacEmail({
//             sender,
//             to: [
//               {
//                 email: email,
//               },
//             ],
//             subject: "OTP Verification",
//             textContent: `This is link for resenting your password : http://localhost:3000/password/resetpassword/${id}`,
//           })
//           .then((result) => {
//             res.status(200).json(result);
//           })
//           .catch((err) => {
//             console.log(err);
//             return res.status(401).json(err);
//           });
//       })
//       .catch((err) => {
//         console.log(err);
//         return res.status(401).json(err);
//       });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// exports.resetPassword = async (req, res) => {
//   const userId = req.params.id;
//   const { password } = req.body;
//   const salt = 10;
//   await ForgotPasswordRequests.findOne({ where: { id: userId } })
//     .then((result) => {
//       if (!result)
//         return res.status(401).json({
//           message: "User Not Found",
//         });
//       if (!result.dataValues.isActive) {
//         return res.status(401).json({
//           message: "Link is expired",
//         });
//       }
//       const hashedPassword = bcryptjs.hashSync(password, salt);
//       User.update(
//         {
//           password: hashedPassword,
//         },
//         { where: { id: result.userId } }
//       )
//         .then((result) => {
//           ForgotPasswordRequests.update(
//             {
//               isActive: false,
//             },
//             {
//               where: {
//                 id: userId,
//               },
//             }
//           )
//             .then((result) => {
//               res.status(201).json(result);
//             })
//             .catch(console.log);
//         })
//         .catch(console.log);
//     })
//     .catch(console.log);
// };
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
            textContent: `Click to the link to reset your password : http://127.0.0.1:5500/frontend/Login/resetPassword.html?id=${id}`,
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