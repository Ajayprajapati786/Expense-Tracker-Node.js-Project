const userController=require('../controller/user');

const express = require('express');

const router = express.Router();

router.post('/admin/signup', userController.postSignup);

router.get("/admin/signup", userController.getSignup);


module.exports = router;