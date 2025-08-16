# Meeting Notes Summarizer

An AI-powered application that allows you to upload meeting transcripts, generate summaries based on custom instructions, edit them, and share via email.

## Features

- **Upload Transcripts**: Paste your meeting notes or call transcripts into the application
- **Custom Instructions**: Specify how you want the AI to summarize the content (e.g., "Summarize in bullet points for executives")
- **AI-Powered Summarization**: Generate structured summaries based on your instructions
- **Edit Summaries**: Edit the generated summaries before sharing
- **Share via Email**: Send the summary to multiple recipients

## Tech Stack

- **Frontend**: React, Bootstrap
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI Integration**: OpenAI API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- OpenAI API key

### Installation

1. Clone the repository
2. Install server dependencies:
   ```
   cd server
   npm install
   ```
3. Install client dependencies:
   ```
   cd client
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the server directory
   - Add the following variables:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     AI_API_KEY=your_openai_api_key
     EMAIL_SERVICE=your_email_service (e.g., gmail)
     EMAIL_USER=your_email_username
     EMAIL_PASS=your_email_password
     ```

### Running the Application

1. Start the backend server:
   ```
   cd server
   npm run dev
   ```
2. Start the frontend development server:
   ```
   cd client
   npm start
   ```
3. Open your browser and navigate to `http://localhost:3000`

## Deployment

The application is deployed and accessible at:
- **Live Demo:** [https://meeting-summerizer-blond.vercel.app](https://meeting-summerizer-blond.vercel.app)
- **Backend API:** [https://meeting-summerizer.onrender.com](https://meeting-summerizer.onrender.com)

For deployment instructions, see the [deployment guide](./deployment-guide.md).

If you want to deploy your own instance, follow these steps:

1. Build the React frontend:
   ```
   cd client
   npm run build
   ```
2. Configure the server to serve the static files from the build directory
3. Deploy to your preferred hosting provider (e.g., Render, Vercel, etc.)

## License

This project is licensed under the MIT License

## Acknowledgements

- OpenAI for providing the AI capabilities
- React and Node.js communities for the excellent libraries and tools
