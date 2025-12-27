const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', leaderboardController.getLeaderboard);
router.post('/', authMiddleware, leaderboardController.updateLeaderboard);

module.exports = router;
