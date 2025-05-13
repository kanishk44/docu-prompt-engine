# DocuPrompt Engine

A full-stack application that processes documents (PDFs, TIFFs), extracts their contents via OCR, and dynamically creates AI prompts to identify and extract key-value pairs.

## Features

- Document upload and processing (PDF, TIFF, PNG, JPG)
- OCR text extraction using Tesseract.js
- AI-powered key-value pair extraction using Google's Gemini
- Batch processing support
- Modern UI with drag-and-drop file upload
- Document history and results viewing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google Cloud API key with Gemini API enabled

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd docu-prompt-engine
```

2. Set up the backend:

```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/docu-prompt-engine
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Set up the frontend:

```bash
cd ../frontend
npm install
```

5. Start the development servers:

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Getting a Gemini API Key

1. Go to the [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click on "Get API key" in the API section
4. Create a new API key or use an existing one
5. Copy the API key and add it to your `.env` file

## Usage

1. Open the application in your browser
2. Upload a document (PDF, TIFF, PNG, or JPG)
3. The application will:
   - Extract text using OCR
   - Generate an AI prompt
   - Extract key-value pairs using Gemini
   - Save the results
4. View processed documents in the Documents page
5. Use batch upload for multiple files of the same type

## Technologies Used

- Frontend:

  - React.js
  - TailwindCSS
  - React Router
  - Axios
  - React Dropzone

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Tesseract.js
  - Google Gemini API
  - pdf-parse

## License

MIT
