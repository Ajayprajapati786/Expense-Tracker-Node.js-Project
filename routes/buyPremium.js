const buyPremiumController = require('../controller/buyPremium')
const userAuthentication = require('../middleware/auth')
const express = require('express');

const router = express.Router();

router.get('/admin/buypremium',userAuthentication.authenticate, buyPremiumController.getPremium);
router.post('/admin/buypremium',userAuthentication.authenticate, buyPremiumController.postPremium);

module.exports = router;

