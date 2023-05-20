const Expense = require("../models/expenses");
const User = require("../models/users");
const { sequelize } = require("../util/database"); // Assuming you have defined the Sequelize instance as 'sequelize'


exports.postexpense = (req, res) => {
  const { money, description, category } = req.body;

  Expense.create({
    expenseamount: money,
    category: category,
    description: description,
    userId:req.user.id

  })
    .then(() => {
      res.status(201).send("User created");
    })
    .catch((err) => {
      console.error("Error creating user:", err);
      res.status(500).send(err);
    });
};



exports.getexpense = (req, res) => {
  User.findOne({ where: { id: req.user.id } })
    .then((user) => {
      if (!user) {
        // Handle case when user is not found
        res.status(404).send("User not found");
        return;
      }

      Expense.findAll({ where: { userId: req.user.id } })
        .then((expenses) => {
          const userData = {
            user: {
              id: user.id,
              username: user.username,
              isPremium: user.isPremium
            },
            expenses: expenses
          };

          res.status(200).json(userData);
        })
        .catch((err) => {
          console.error("Error retrieving expenses:", err);
          res.status(500).send(err);
        });
    })
    .catch((err) => {
      console.error("Error retrieving user:", err);
      res.status(500).send(err);
    });
};


exports.deleteexpense =  (req, res) => {
  console.log(`kjnjm8888888************************* ${req}`)
  const id = req.params.id;
  Expense.destroy({ where: { id: id,userId:req.user.id } })
    .then(() => {
      res.send("User deletedd");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting userrrrrrr");
    });
}