const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/settings', gameController.getSettings);
router.post('/start', gameController.startGame);
router.post('/score', authMiddleware, gameController.submitScore);

module.exports = router;
