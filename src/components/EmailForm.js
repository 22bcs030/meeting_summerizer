import React, { useState } from 'react';
import { shareSummaryViaEmail } from '../services/api';
import './EmailForm.css';

const EmailForm = ({ summaryId, onClose }) => {
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('Meeting Summary');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const emailList = recipients.split(',').map(email => email.trim());
    if (emailList.length === 0 || emailList[0] === '') {
      setError('Please enter at least one recipient email address');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const result = await shareSummaryViaEmail(summaryId, emailList, subject);
      
      if (result.success) {
        setSuccess('Summary sent successfully');
        // Reset form after successful send
        setRecipients('');
      } else {
        setError(result.error || 'Failed to send email');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while sending the email');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="email-form-container">
      <div className="email-form-content">
        <div className="email-form-header">
          <h3>Share Summary via Email</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="recipients">Recipients</label>
            <input
              id="recipients"
              className="form-control"
              type="text"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="email@example.com, another@example.com"
              required
            />
            <small className="form-text text-muted">
              Separate multiple email addresses with commas
            </small>
          </div>
          
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              className="form-control"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Meeting Summary"
              required
            />
          </div>
          
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || !recipients.trim()}
            >
              {loading ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailForm;
