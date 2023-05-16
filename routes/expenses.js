const expenseController=require('../controller/expense');

const express = require('express');

const router = express.Router();

router.post('/admin/expense', expenseController.postexpense);
router.get('/admin/expense', expenseController.getexpense);
router.delete("/admin/expense/:id",expenseController.deleteexpense);

module.exports = router;