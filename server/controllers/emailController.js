const emailService = require('../services/emailService');
const Summary = require('../models/Summary');

/**
 * Controller for handling email-related operations
 */
exports.sendSummaryEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { recipients, subject } = req.body;
    
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Recipients list is required and must be an array with at least one email' 
      });
    }
    
    // Find the summary
    const summary = await Summary.findById(id);
    
    if (!summary) {
      return res.status(404).json({ success: false, error: 'Summary not found' });
    }
    
    // Use edited summary if available, otherwise use original summary
    const contentToSend = summary.editedSummary || summary.summary;
    
    // Send email
    const emailResult = await emailService.sendSummary(
      recipients, 
      subject || 'Meeting Summary', 
      contentToSend
    );
    
    // Update the summary document with the recipients
    const sentAt = new Date();
    recipients.forEach(email => {
      summary.sharedWith.push({ email, sentAt });
    });
    
    await summary.save();
    
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      emailResult,
    });
  } catch (error) {
    console.error('Error sending summary email:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
