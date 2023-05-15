const User = require('../models/users');

exports.postSignup = (req, res) => {
  const { name, email, password } = req.body;
  console.log("-----------------------");
  console.log(name, email, password);
  User.create({
    name: name,
    email: email,
    password: password,
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
};


exports.getSignup= (req, res) => {
    User.findAll()
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error getting users");
      });
  }


// ----------------------------------------------


exports.postLogin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ where: { email: email } })
    .then(user => {
      if (!user) {
        // User not found
        return res.status(404).send("User not found");
      }

      if (user.password !== password) {
        // Invalid password
        return res.status(401).send("Invalid password");
      }

      // Login successful
      res.status(200).send("Login successful");
    })
    .catch(err => {
      console.error("Error during login:", err);
      res.status(500).send("Error during login");
    });
};

