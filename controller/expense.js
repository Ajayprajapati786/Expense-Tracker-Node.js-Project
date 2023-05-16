const Expense = require("../models/expenses");

exports.postexpense = (req, res) => {
  const { money, description, category } = req.body;

  Expense.create({
    expenseamount: money,
    category: category,
    description: description,
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
  Expense.findAll()
    .then((expenses) => {
      res.status(200).json(expenses);
    })
    .catch((err) => {
      console.error("Error retrieving expenses:", err);
      res.status(500).send(err);
    });
};


exports.deleteexpense =  (req, res) => {
  const id = req.params.id;
  Expense.destroy({ where: { id: id } })
    .then(() => {
      res.send("User deletedd");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting userrrrrrr");
    });
}