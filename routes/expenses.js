const expenseController=require('../controller/expense');

const userAuthentication = require('../middleware/auth')
const express = require('express');

const router = express.Router();

router.post('/admin/expense',userAuthentication.authenticate, expenseController.postexpense);
router.get('/admin/expense',userAuthentication.authenticate, expenseController.getexpense);
router.delete("/admin/expense/:id", userAuthentication.authenticate,expenseController.deleteexpense);


router.get('/admin/download',userAuthentication.authenticate, expenseController.downloadexpense );
router.get('/admin/Links',userAuthentication.authenticate, expenseController.getLinks );



module.exports = router;

