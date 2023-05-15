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
