# Meeting Notes Summarizer - Technical Documentation

## Project Overview

This document outlines the approach, process, and technical choices made for the Meeting Notes Summarizer application. The application allows users to upload meeting transcripts, generate AI-powered summaries based on custom instructions, edit these summaries, and share them via email.

## Approach

### 1. Understanding Requirements

The key requirements identified were:
- Upload text transcripts (meeting notes, call transcripts)
- Input custom instructions/prompts for summarization
- Generate structured AI summaries
- Edit generated summaries
- Share summaries via email
- Focus on functionality over design
- Deploy the application

### 2. Architecture Decision

Chose the MERN (MongoDB, Express, React, Node.js) stack for the following reasons:
- **MongoDB**: Flexible document-oriented database that's ideal for storing varied-length text content like transcripts and summaries
- **Express**: Lightweight, fast backend framework that integrates well with Node.js
- **React**: Component-based frontend library that enables creating a responsive and interactive UI
- **Node.js**: JavaScript runtime that allows using the same language across the full stack

### 3. Component Structure

#### Backend (Express/Node.js)
- RESTful API architecture
- Service-oriented design separating concerns:
  - Controllers: Handle HTTP requests/responses
  - Services: Contain business logic (AI processing, email sending)
  - Models: Define data structures
  - Routes: Define API endpoints

#### Frontend (React)
- Component-based architecture
- Key components:
  - SummarizerForm: For transcript input and prompt customization
  - SummaryEditor: For viewing and editing the generated summary
  - EmailForm: For sharing summaries via email

## Process

### 1. Development Workflow

1. **Backend First**: Developed the backend API to handle the core functionality
   - Created MongoDB schema for storing summaries
   - Implemented AI integration service
   - Set up email service for sharing
   - Created RESTful API endpoints

2. **Frontend Development**: Built the React frontend components
   - Created form for transcript input and custom instructions
   - Developed editor for modifying generated summaries
   - Built email sharing form
   - Connected to backend API using Axios

3. **Integration**: Connected frontend and backend components

### 2. AI Integration

- Used OpenAI's API (specifically GPT models) for generating summaries
- Designed a prompt structure that combines:
  - System instructions to specify the role as a meeting summarizer
  - User's custom instructions (e.g., "Summarize in bullet points for executives")
  - The meeting transcript content

### 3. Email Functionality

- Implemented using Nodemailer for handling email sending
- Created a service that:
  - Formats the summary in HTML
  - Sends to multiple recipients
  - Stores a record of who the summary was shared with

## Tech Stack Details

### Backend
- **Node.js & Express**: Server runtime and framework
- **MongoDB & Mongoose**: Database and ODM
- **OpenAI API**: AI service for generating summaries
- **Nodemailer**: Email sending functionality
- **Multer**: For handling file uploads (future enhancement)
- **Dotenv**: For environment variable management
- **CORS**: For handling cross-origin requests

### Frontend
- **React**: UI library
- **React Router**: For navigation (future enhancement for multi-page structure)
- **Axios**: For API requests
- **Bootstrap**: Basic styling framework
- **React Hooks**: For state management

## Deployment Strategy

1. **Backend Deployment**:
   - Hosted on Render.com at [https://meeting-summerizer.onrender.com](https://meeting-summerizer.onrender.com)
   - Environment variables set for database connection, API keys, email service, etc.
   - MongoDB hosted on MongoDB Atlas

2. **Frontend Deployment**:
   - Built static assets using `npm run build`
   - Hosted on Vercel at [https://meeting-summerizer-blond.vercel.app](https://meeting-summerizer-blond.vercel.app)
   - Configured to point to the deployed backend API through environment variables

## Future Enhancements

1. **Authentication**: Add user accounts to save and manage summaries
2. **File Upload**: Allow uploading transcript files (PDF, DOCX, etc.)
3. **Summary History**: View and manage past summaries
4. **Templates**: Save and reuse custom instruction templates
5. **Enhanced AI Models**: Options for different AI models based on use case

## Conclusion

The MERN stack provided a robust foundation for building this application, with MongoDB's flexibility for text storage, Express for API development, React for the interactive frontend, and Node.js tying everything together. The focus was kept on functionality over design as requested, creating a working application that meets all the specified requirements.
