import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SummarizerForm from './components/SummarizerForm';
import SummaryEditor from './components/SummaryEditor';
import EmailForm from './components/EmailForm';

function App() {
  const [summary, setSummary] = useState(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  
  const handleSummaryGenerated = (data) => {
    setSummary(data);
    window.scrollTo({ top: document.getElementById('editor-section')?.offsetTop || 0, behavior: 'smooth' });
  };
  
  const handleSummaryUpdated = (updatedSummary) => {
    setSummary(updatedSummary);
  };
  
  const handleShare = (summaryId, content) => {
    setShowEmailForm(true);
  };
  
  const handleNewSummary = () => {
    setSummary(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCloseEmailForm = () => {
    setShowEmailForm(false);
  };
  
  return (
    <div className="App">
      <header className="app-header">
        <h1>Meeting Notes Summarizer</h1>
        <p>Upload transcripts, summarize, edit, and share meeting notes easily</p>
      </header>
      
      <div className="container">
        <section className="form-section">
          <SummarizerForm onSummaryGenerated={handleSummaryGenerated} />
        </section>
        
        {summary && (
          <section id="editor-section" className="editor-section">
            <div className="new-summary-container">
              <button 
                className="btn btn-primary new-summary-btn" 
                onClick={handleNewSummary}
              >
                ← Create New Summary
              </button>
            </div>
            <SummaryEditor 
              summary={summary} 
              onSummaryUpdated={handleSummaryUpdated} 
              onShare={handleShare}
            />
          </section>
        )}
        
        {showEmailForm && (
          <EmailForm 
            summaryId={summary?._id} 
            onClose={handleCloseEmailForm} 
          />
        )}
      </div>
      
      <footer className="app-footer">
        <p>© 2025 Meeting Notes Summarizer</p>
      </footer>
    </div>
  );
}

export default App;
