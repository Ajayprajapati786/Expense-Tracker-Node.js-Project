const userController=require('../controller/user');

const express = require('express');

const router = express.Router();

router.post('/admin/signup', userController.postSignup);

router.get("/admin/signup", userController.getSignup);

router.post('/admin/login', userController.postLogin);

router.post('/password/forgotpassword', userController.postForgotPassword);


router.get('/password/resetpassword/:resetId', userController.getResetPasswordForm);
router.get('/password/updatepassword/:updateId', userController.updatePassword);



module.exports = router;