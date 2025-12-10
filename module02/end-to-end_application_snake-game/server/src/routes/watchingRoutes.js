const express = require('express');
const router = express.Router();
const watchingController = require('../controllers/watchingController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/players', watchingController.getWatchingPlayers);
router.post('/:playerId/start', authMiddleware, watchingController.startWatching);
router.post('/:playerId/stop', authMiddleware, watchingController.stopWatching);

module.exports = router;
