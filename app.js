const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize=require('./util/database');
const adminRouter=require('./routes/user');
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(adminRouter);

app.use(express.static("public"));

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});


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
