const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


var SibApiV3Sdk = require('sib-api-v3-sdk');
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
          if (err.name === 'SequelizeUniqueConstraintError') {
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

function generateAccessToken (id){
  return jwt.sign({userId: id}, 'token')
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
        res.status(200).json({ token: generateAccessToken(user.id), message: "Login successful" });
      });
    })
    .catch((err) => {
      console.error("Error during login:", err);
      res.status(500).send("Error during login");
    });
};

exports.postForgotPassword = (req, res) => {
  const { email } = req.body;
  console.log(email);

  // Configure API key authorization: api-key
  var apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.API_KEY;;

  var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.to = [{ email: email, name: 'Ajay' }];
  sendSmtpEmail.sender = { email: 'your-email@example.com', name: 'Your Name' };
  sendSmtpEmail.subject = 'Forgot Password';
  sendSmtpEmail.htmlContent = '<p>Hello, Please reset your password.</p>';

  apiInstance.sendTransacEmail(sendSmtpEmail)
    .then(function(data) {
      console.log('API called successfully. Returned data: ' + JSON.stringify(data));
      res.status(200).json({ message: 'Email sent successfully' });
    })
    .catch(function(error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to send email' });
    });
};



