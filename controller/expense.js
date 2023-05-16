const Expense = require("../models/expenses");

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
  Expense.findAll({where:{userId:req.user.id}})
    .then((expenses) => {
      res.status(200).json(expenses);
    })
    .catch((err) => {
      console.error("Error retrieving expenses:", err);
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