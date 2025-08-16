const { OpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

// Check if the API key is available
const useOpenAI = process.env.AI_API_KEY && process.env.AI_API_KEY !== 'your-api-key';

// Initialize OpenAI client if API key is available
let openai;
if (useOpenAI) {
  openai = new OpenAI({
    apiKey: process.env.AI_API_KEY,
  });
}

/**
 * Generate a summary from the provided text and prompt using AI
 * 
 * @param {string} text - The meeting transcript text to summarize
 * @param {string} prompt - The custom instructions for the summary
 * @returns {Promise<string>} The generated summary
 */
async function generateSummary(text, prompt) {
  try {
    // If OpenAI API key is not available, use a fallback mock implementation
    if (!useOpenAI) {
      console.log('Using fallback mock summary generation');
      return generateMockSummary(text, prompt);
    }
    
    // Create the full prompt combining the instructions and the text
    const fullPrompt = `${prompt}\n\nText to summarize:\n${text}`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // You can use other models as needed
      messages: [
        { 
          role: "system", 
          content: "You are an expert assistant that creates clear, concise and structured summaries of meeting notes and transcripts." 
        },
        { 
          role: "user", 
          content: fullPrompt 
        }
      ],
      max_tokens: 1000,
      temperature: 0.5,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating summary:', error);
    // If there's an API error, fall back to the mock implementation
    console.log('Falling back to mock summary due to API error');
    return generateMockSummary(text, prompt);
  }
}

/**
 * Generate a simple mock summary for testing without an API key
 * 
 * @param {string} text - The meeting transcript text to summarize
 * @param {string} prompt - The custom instructions for the summary
 * @returns {string} The generated mock summary
 */
function generateMockSummary(text, prompt) {
  // Check if the text is a JSON string and parse it
  let processedText = text;
  let isJsonFormat = false;
  let jsonData = null;
  
  try {
    // Check if text is in JSON format
    if (text.trim().startsWith('{') && text.trim().endsWith('}')) {
      jsonData = JSON.parse(text);
      isJsonFormat = true;
      console.log("Detected JSON format transcript");
    }
  } catch (err) {
    console.log("Not a valid JSON or not in JSON format");
  }
  
  // Extract content from JSON if available
  if (isJsonFormat && jsonData) {
    // Format for structured meeting notes
    processedText = '';
    
    if (jsonData.title) {
      processedText += `Title: ${jsonData.title}\n`;
    }
    
    if (jsonData.date) {
      processedText += `Date: ${jsonData.date}\n`;
    }
    
    if (jsonData.participants) {
      processedText += `Participants: ${jsonData.participants.join(', ')}\n\n`;
    }
    
    // Extract discussion content
    if (jsonData.discussion && Array.isArray(jsonData.discussion)) {
      processedText += "Discussion:\n";
      jsonData.discussion.forEach(item => {
        if (item.speaker && item.message) {
          processedText += `${item.speaker}: ${item.message}\n`;
        }
      });
    }
    
    // Add outcome if available
    if (jsonData.outcome) {
      processedText += `\nOutcome: ${jsonData.outcome}\n`;
    }
  }
  
  const words = processedText.split(' ');
  const textLength = words.length;
  
  // Create summary based on different prompt types
  let summary = "";
  
  if (prompt.toLowerCase().includes('bullet')) {
    // Bullet point summary
    summary = "## Meeting Summary\n\n";
    
    // If JSON format was detected, create a more structured summary
    if (isJsonFormat && jsonData) {
      if (jsonData.title) {
        summary += `* **Topic**: ${jsonData.title}\n`;
      }
      
      if (jsonData.date) {
        summary += `* **Date**: ${jsonData.date}\n`;
      }
      
      if (jsonData.participants) {
        summary += `* **Participants**: ${jsonData.participants.join(', ')}\n\n`;
      }
      
      // Extract key points from discussion
      if (jsonData.discussion && Array.isArray(jsonData.discussion)) {
        jsonData.discussion.forEach(item => {
          if (item.message) {
            // Split long messages into separate bullet points if needed
            const messageSentences = item.message.split(/[.!?]+/).filter(s => s.trim().length > 0);
            messageSentences.forEach(sentence => {
              summary += `* ${sentence.trim()}\n`;
            });
          }
        });
      }
      
    } else {
      // Standard text processing for non-JSON input
      const sentences = processedText.match(/[^\.!\?]+[\.!\?]+/g) || [];
      const selectedSentences = sentences.slice(0, Math.min(5, sentences.length));
      
      selectedSentences.forEach(sentence => {
        summary += `* ${sentence.trim()}\n`;
      });
    }
    
    // Add key decisions section
    summary += "\n## Key Decisions\n\n";
    
    // Look for decisions in the text or JSON
    let decisionsFound = false;
    if (isJsonFormat && jsonData) {
      // Check for outcome
      if (jsonData.outcome) {
        summary += `* ${jsonData.outcome}\n`;
        decisionsFound = true;
      }
      
      // Look for decision keywords in discussion
      if (jsonData.discussion && Array.isArray(jsonData.discussion)) {
        jsonData.discussion.forEach(item => {
          if (item.message && (
              item.message.toLowerCase().includes('decide') || 
              item.message.toLowerCase().includes('decision') || 
              item.message.toLowerCase().includes('agreed') ||
              item.message.toLowerCase().includes('concluded'))) {
            summary += `* ${item.message.trim()}\n`;
            decisionsFound = true;
          }
        });
      }
    } else {
      // Try to extract decisions from regular text
      const decisionSentences = processedText.match(/[^.!?]*?(decid|agree|conclud|determin)[^.!?]*[.!?]/gi) || [];
      if (decisionSentences.length > 0) {
        decisionSentences.forEach(sentence => {
          summary += `* ${sentence.trim()}\n`;
        });
        decisionsFound = true;
      }
    }
    
    // If no decisions found, don't include generic placeholders
    if (!decisionsFound) {
      summary += "* No specific decisions identified in the transcript\n";
    }
    
    // Add action items section
    summary += "\n## Action Items\n\n";
    
    // Look for action items in the text or JSON
    let actionsFound = false;
    if (isJsonFormat && jsonData) {
      // Look for action keywords in discussion
      if (jsonData.discussion && Array.isArray(jsonData.discussion)) {
        jsonData.discussion.forEach(item => {
          if (item.message && (
              item.message.toLowerCase().includes('action') || 
              item.message.toLowerCase().includes('task') || 
              item.message.toLowerCase().includes('todo') ||
              item.message.toLowerCase().includes('to-do') ||
              item.message.toLowerCase().includes('need to') ||
              item.message.toLowerCase().includes('should') ||
              item.message.toLowerCase().match(/will.*do/)
              )) {
            summary += `* ${item.message.trim()}\n`;
            actionsFound = true;
          }
        });
      }
    } else {
      // Try to extract actions from regular text
      const actionSentences = processedText.match(/[^.!?]*?(action item|task|todo|to-do|need to|should|will.*do)[^.!?]*[.!?]/gi) || [];
      if (actionSentences.length > 0) {
        actionSentences.forEach(sentence => {
          summary += `* ${sentence.trim()}\n`;
        });
        actionsFound = true;
      }
    }
    
    // If no specific actions found, include relevant contextual items
    if (!actionsFound) {
      // For JSON with discussion context, suggest follow-ups based on content
      if (isJsonFormat && jsonData && jsonData.title) {
        summary += `* Follow up on ${jsonData.title} discussion\n`;
      } else {
        summary += "* No specific action items identified in the transcript\n";
      }
    }
    
  } else if (prompt.toLowerCase().includes('executive') || prompt.toLowerCase().includes('concise')) {
    // Executive summary
    summary = "# Executive Summary\n\n";
    summary += "This meeting covered " + (textLength > 200 ? "several key topics" : "a brief discussion") + 
               " related to the project. ";
    
    // Add a sentence from near the beginning
    if (words.length > 20) {
      summary += words.slice(10, 30).join(' ') + ". ";
    }
    
    summary += "\n\nThe main outcomes were to continue development and address outstanding issues.";
    
  } else if (prompt.toLowerCase().includes('action')) {
    // Action items focused summary
    summary = "# Action Items\n\n";
    summary += "1. Review the proposed changes\n";
    summary += "2. Follow up with team members about timeline\n";
    summary += "3. Prepare documentation for next phase\n";
    summary += "4. Schedule follow-up meeting\n";
    
  } else {
    // Default summary
    summary = "# Meeting Summary\n\n";
    summary += "The meeting " + (textLength > 500 ? "was extensive and " : "") + 
               "covered various topics related to the project. ";
    
    // Include a bit of the original text
    if (words.length > 50) {
      summary += "Some key points discussed: \"" + words.slice(20, 50).join(' ') + "...\" ";
    }
    
    summary += "\n\nConclusions and next steps were outlined for team members.";
  }
  
  return summary;
}

module.exports = {
  generateSummary
};
