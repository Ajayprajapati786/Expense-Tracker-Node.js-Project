const expenseController=require('../controller/expense');

const userAuthentication = require('../middleware/auth')
const express = require('express');

const router = express.Router();

router.post('/admin/expense',userAuthentication.authenticate, expenseController.postexpense);
router.get('/admin/expense',userAuthentication.authenticate, expenseController.getexpense);
router.delete("/admin/expense/:id", userAuthentication.authenticate,expenseController.deleteexpense);

module.exports = router;

