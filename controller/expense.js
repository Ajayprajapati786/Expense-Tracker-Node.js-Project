const Expense = require("../models/expenses");
const User = require("../models/users");
const Links = require("../models/Links");
const { sequelize } = require("../util/database"); 
const AWS = require('aws-sdk')
require('dotenv').config();


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
  const { page, limit } = req.query; // Extract page and limit parameters from query string
  const offset = (page - 1) * limit; // Calculate the offset for pagination

  User.findOne({ where: { id: req.user.id } })
    .then((user) => {
      if (!user) {
        // Handle case when user is not found
        res.status(404).send("User not found");
        return;
      }

      Expense.findAndCountAll({
        where: { userId: req.user.id },
        limit: parseInt(limit), // Convert limit to a number
        offset: parseInt(offset), // Convert offset to a number
      })
        .then((result) => {
          const expenses = result.rows;
          const totalCount = result.count;
          const userData = {
            user: {
              id: user.id,
              username: user.username,
              isPremium: user.isPremium,
            },
            expenses,
            totalCount,
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
  console.log(`************************* ${req}`)
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


exports.downloadexpense = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const user = await User.findOne({
      where: { email: userEmail },
      include: Expense,
    });

    if (!user) {
      console.log("User not found");
      return;
    }
    const stringifiedExpenses = JSON.stringify(user.expenses);
    console.log(stringifiedExpenses);

    const userId = req.user.id;
    const fileName = `Expenses${userId}/${new Date()}.txt`;
    const fileURL = await uploadToS3(stringifiedExpenses, fileName);

    // Store fileURL with userId in the Links table
    const link = await Links.create({ Link: fileURL, userId: userId });
    res.status(200).json({ fileURL, success: true });
  } catch (error) {
    console.log("Error retrieving expenses:", error);
  }
};


async function uploadToS3(data, filename) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const I_AM_USER_SECRET = process.env.I_AM_USER_SECRET;

  const s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: I_AM_USER_SECRET,
  });

  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: 'public-read'
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("Something went wrong", err);
        reject(err);
      } else {
        console.log('success', s3response);
        resolve(s3response.Location);
      }
    });
  });

}

exports.getLinks = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all links associated with the user
    const links = await Links.findAll({ where: { userId } });

    res.status(200).json({ links, success: true });
  } catch (error) {
    console.log("Error retrieving links:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};



