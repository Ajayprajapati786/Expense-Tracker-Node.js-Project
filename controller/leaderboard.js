const User = require("../models/users");
const Expense = require("../models/expenses");
const Sequelize = require("sequelize");

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.findAll({
      attributes: [
        "name",
        [Sequelize.fn("SUM", Sequelize.col("expenses.expenseamount")), "totalExpense"],
      ],
      include: [
        {
          model: Expense,
          attributes : [],
        },
      ],
      group: ["User.id"],
      order: [[Sequelize.literal("totalExpense"), "DESC"]],
    });

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
