const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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

  
