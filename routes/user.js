const userController=require('../controller/user');

const express = require('express');

const router = express.Router();

router.post('/login', userController.postSignup);

module.exports = router;