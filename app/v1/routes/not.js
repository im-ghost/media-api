const express = require('express');
const router = express.Router();
const {
  getNotifications,
  postNotification,
  deleteNotification
} = require("../controllers/user");
const {
  protect,
  protectNotification
} = require("../middlewares/auth");
// Get notifications for a user
router.get('/n/:id',protect, getNotifications)
router.post('/n/:id',protect, postNotification);

router.delete("/n/:id/:notificationId", protect, protectNotification, deleteNotification);

module.exports = router;
