const express = require('express');
const emailController = require('../controllers/emailController');

const router = express.Router();

// POST /api/email/:id - Send a summary via email
router.post('/:id', emailController.sendSummaryEmail);

module.exports = router;
