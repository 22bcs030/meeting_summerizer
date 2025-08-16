import React, { useState, useRef } from 'react';
import { generateSummary } from '../services/api';
import './SummarizerForm.css';

const SummarizerForm = ({ onSummaryGenerated }) => {
  const [transcript, setTranscript] = useState('');
  const [prompt, setPrompt] = useState('Summarize in bullet points');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setTranscript(event.target.result);
    };
    reader.onerror = (error) => {
      setError('Error reading file: ' + error);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!transcript.trim()) {
      setError('Please enter transcript text or upload a file');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Check if backend server is running by making a simple test request
      try {
        // Test if the server is reachable
        await fetch('/api');
      } catch (connectionError) {
        console.error("Backend connection error:", connectionError);
        setError('Cannot connect to the backend server. Make sure the server is running on port 5000.');
        setLoading(false);
        return;
      }
      
      const result = await generateSummary(transcript, prompt);
      
      if (result.success) {
        onSummaryGenerated(result.data);
        // Reset file name but keep transcript visible
        setFileName('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setError(result.error || 'Failed to generate summary');
      }
    } catch (err) {
      console.error("Summary generation error:", err);
      if (err.includes && err.includes('API key')) {
        setError('AI API key issue: ' + err);
      } else if (err.includes && err.includes('MongoDB')) {
        setError('Database connection error: ' + err);
      } else {
        setError('Error generating summary: ' + (err.message || err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="summarizer-form-container">
      <h2>Meeting Notes Summarizer</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="transcript">Meeting Transcript</label>
          <div className="file-upload-container">
            <input
              type="file"
              id="file-upload"
              className="file-input"
              onChange={handleFileUpload}
              accept=".txt,.md,.doc,.docx"
              ref={fileInputRef}
            />
            <label htmlFor="file-upload" className="file-upload-label">
              <span className="upload-icon">📁</span> 
              {fileName ? fileName : 'Upload Transcript File'}
            </label>
          </div>
          <textarea
            id="transcript"
            className="form-control"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your meeting transcript here or upload a file..."
            rows={10}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="prompt">Custom Instructions</label>
          <input
            id="prompt"
            className="form-control"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Summarize in bullet points for executives"
            required
          />
          <small className="form-text text-muted">
            Examples: "Extract action items only", "Create a concise executive summary", "Focus on key decisions"
          </small>
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading || !transcript.trim()}
        >
          {loading ? 'Generating...' : 'Generate Summary'}
        </button>
      </form>
    </div>
  );
};

export default SummarizerForm;
