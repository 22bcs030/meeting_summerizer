import React, { useState } from 'react';
import { updateSummary } from '../services/api';
import './SummaryEditor.css';

const SummaryEditor = ({ summary, onSummaryUpdated, onShare }) => {
  const [editedContent, setEditedContent] = useState(summary.editedSummary || summary.summary);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const result = await updateSummary(summary._id, editedContent);
      
      if (result.success) {
        setSuccess('Summary updated successfully');
        onSummaryUpdated(result.data);
      } else {
        setError(result.error || 'Failed to update summary');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating the summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="summary-editor-container">
      <h2>Summary Editor</h2>
      
      <div className="editor-info">
        <p><strong>Original Prompt:</strong> {summary.prompt}</p>
      </div>
      
      <div className="form-group">
        <label htmlFor="editedSummary">Edit Summary</label>
        <textarea
          id="editedSummary"
          className="form-control"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          rows={12}
        />
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="button-group">
        <button 
          className="btn btn-primary" 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        
        <button 
          className="btn btn-success"
          onClick={() => onShare(summary._id, editedContent)}
        >
          Share via Email
        </button>
      </div>
    </div>
  );
};

export default SummaryEditor;
