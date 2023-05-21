const { v4: uuidv4 } = require("uuid");
var SibApiV3Sdk = require("sib-api-v3-sdk");


const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ForgotPasswordRequest = require("../models/reset-password");

require("dotenv").config();

var defaultClient = SibApiV3Sdk.ApiClient.instance;

exports.postSignup = (req, res) => {
  const { name, email, password } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.error("Error generating salt:", err);
      return res.status(500).send("Error creating user backend");
    }

    bcrypt.hash(password, salt, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).send("Error creating user backend");
      }

      User.create({
        name: name,
        email: email,
        password: hashedPassword,
      })
        .then(() => {
          res.status(201).send("User created");
        })
        .catch((err) => {
          console.error("Error creating user:", err);
          if (err.name === "SequelizeUniqueConstraintError") {
            res.status(400).send("Email address already exists");
          } else {
            res.status(500).send("Error creating user backend");
          }
        });
    });
  });
};

exports.getSignup = (req, res) => {
  User.findAll()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error getting users");
    });
};

function generateAccessToken(id) {
  return jwt.sign({ userId: id }, "token");
}

exports.postLogin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).send("Error during login");
        }

        if (!result) {
          return res.status(401).send("Invalid password");
        }

        // Send the email and id of the logged-in user
        res
          .status(200)
          .json({
            token: generateAccessToken(user.id),
            message: "Login successful",
          });
      });
    })
    .catch((err) => {
      console.error("Error during login:", err);
      res.status(500).send("Error during login");
    });
};

exports.postForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(500).json({ error: "Failed to find user" });
    }
    console.log(`-------------------------------------${user.id}
    ------------------------------------------------
    -------------------------------------------------`);
    console.log("working");

    const createForgotPasswordRequest = () => {
      return new Promise((resolve, reject) => {
        const forgotPasswordResponse = ForgotPasswordRequest.create({
          id: uuidv4(),
          isActive: true,
          userId: user.id,
        });
        if (forgotPasswordResponse) {
          resolve(forgotPasswordResponse);
        } else {
          reject("Failed to create forgot password request");
        }
      });
    };

    const forgotPasswordResponse = await createForgotPasswordRequest();
    console.log("working", forgotPasswordResponse);

    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.API_KEY;
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email, name: "Jisko bhejna hai" }];
    sendSmtpEmail.sender = {
      email: "company-email@example.com",
      name: "Your Name",
    };
    sendSmtpEmail.subject = "Forgot Password";
    sendSmtpEmail.htmlContent = `<h2>Click below link to reset your password</h2>
      <a href="http://localhost:5000/password/resetpassword/${forgotPasswordResponse.id}"> click here to reset password </a>`;

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("API called successfully. Returned data: " + JSON.stringify(data));
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
};



exports.getResetPasswordForm = async (req, res, next) => {
  const id = req.params.resetId;
  try {
      const forgotPassowordResponse = await ForgotPasswordRequest.findOne({ where: { id: id } });
      if (!forgotPassowordResponse) {
          return res.status(404).json({
              error: 'Invalid Request'
          });
      }
      if (forgotPassowordResponse.isActive) {
          // forgotPassowordResponse.update({ isActive: false });
          res.status(200).send(`<html>
                                  <script>
                                      function formsubmitted(e){
                                          e.preventDefault();
                                          console.log('called')
                                      }
                                  </script>
                                  <form action="http://localhost:5000/password/updatepassword/${id}" method="get">
                                      <label for="newpassword">Enter New password</label>
                                      <input name="newpassword" type="password" required></input>
                                      <button type="submit">reset password</button>
                                  </form>
                              </html>`
          )
          return res.end()
      }
      return res.send('<h1>Not Valid Request</h1>');
  } catch (err) {
      console.log(err);
      return res.status(500).json({
          error: err
      });
  }
}


exports.updatePassword = async (req, res, next) => {
  try {
    const { newpassword } = req.query;
    const updateId = req.params.updateId;
    const forgotPasswordResponse = await ForgotPasswordRequest.findOne({ where: { id: updateId } });
    const user = await User.findOne({ where: { id: forgotPasswordResponse.userId } });

    if (user) {
      const hashedPassword = await bcrypt.hash(newpassword, 12);
      user.password = hashedPassword;
      await user.save();
      await forgotPasswordResponse.update({ isActive: false });
      res.status(200).redirect('http://localhost:5000/login');
    } else {
      return res.status(404).json({
        error: 'User does not exist'
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err
    });
  }
};