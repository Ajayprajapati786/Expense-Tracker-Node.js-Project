const buyPremiumController = require('../controller/buyPremium')
const userAuthentication = require('../middleware/auth')
const leaderboardController = require('../controller/leaderboard')
const express = require('express');

const router = express.Router();

router.get('/admin/buypremium',userAuthentication.authenticate, buyPremiumController.getPremium);
router.post('/admin/buypremium',userAuthentication.authenticate, buyPremiumController.postPremium);

router.get('/premium/leaderboard',leaderboardController.getLeaderboard)
module.exports = router;

