const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize=require('./util/database');
const adminRouter=require('./routes/user');
const expenseRouter=require('./routes/expenses');
const premiumMembership = require('./routes/buyPremium')
const ForgotPasswordRequest = require('./models/reset-password');
const User = require('./models/users')
const Expenses = require('./models/expenses');
const Order = require("./models/order");
const Links = require("./models/Links");
const app = express();
app.use(bodyParser.json());
app.use(cors());



app.use(adminRouter);
app.use(expenseRouter);
app.use(premiumMembership);

app.use(express.static("public"));

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.get("/expense", (req, res) => {
  res.sendFile(__dirname + "/public/expense.html");
});

User.hasMany(Expenses);
Expenses.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

User.hasMany(Links);
Links.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
  })
  .catch((err) => {
    console.log("Error creating database and tables: ", err);
  });

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
