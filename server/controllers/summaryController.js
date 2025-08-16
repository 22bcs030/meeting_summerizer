const Summary = require('../models/Summary');
const aiService = require('../services/aiService');

/**
 * Controller for handling summary-related operations
 */
exports.createSummary = async (req, res) => {
  try {
    const { text, prompt } = req.body;
    
    if (!text || !prompt) {
      return res.status(400).json({ success: false, error: 'Text and prompt are required' });
    }

    // Generate summary using AI service
    const summary = await aiService.generateSummary(text, prompt);
    
    // Save to database
    const newSummary = new Summary({
      originalText: text,
      prompt,
      summary,
      editedSummary: summary, // Initially set to the same as generated summary
    });
    
    await newSummary.save();
    
    return res.status(201).json({
      success: true,
      data: newSummary,
    });
  } catch (error) {
    console.error('Error creating summary:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Update a summary with edited content
 */
exports.updateSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const { editedSummary } = req.body;
    
    if (!editedSummary) {
      return res.status(400).json({ success: false, error: 'Edited summary content is required' });
    }
    
    const summary = await Summary.findById(id);
    
    if (!summary) {
      return res.status(404).json({ success: false, error: 'Summary not found' });
    }
    
    summary.editedSummary = editedSummary;
    summary.updatedAt = Date.now();
    
    await summary.save();
    
    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Error updating summary:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get a specific summary by ID
 */
exports.getSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const summary = await Summary.findById(id);
    
    if (!summary) {
      return res.status(404).json({ success: false, error: 'Summary not found' });
    }
    
    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get all summaries (with optional pagination)
 */
exports.getAllSummaries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const summaries = await Summary.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Summary.countDocuments();
    
    return res.status(200).json({
      success: true,
      count: summaries.length,
      total,
      data: summaries,
    });
  } catch (error) {
    console.error('Error fetching summaries:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Delete a summary
 */
exports.deleteSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const summary = await Summary.findById(id);
    
    if (!summary) {
      return res.status(404).json({ success: false, error: 'Summary not found' });
    }
    
    await summary.remove();
    
    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Error deleting summary:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
