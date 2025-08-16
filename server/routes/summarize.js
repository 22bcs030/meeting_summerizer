const express = require('express');
const summaryController = require('../controllers/summaryController');

const router = express.Router();

// POST /api/summarize - Create a new summary
router.post('/', summaryController.createSummary);

// GET /api/summarize - Get all summaries (with pagination)
router.get('/', summaryController.getAllSummaries);

// GET /api/summarize/:id - Get a specific summary
router.get('/:id', summaryController.getSummary);

// PUT /api/summarize/:id - Update a summary
router.put('/:id', summaryController.updateSummary);

// DELETE /api/summarize/:id - Delete a summary
router.delete('/:id', summaryController.deleteSummary);

module.exports = router;
