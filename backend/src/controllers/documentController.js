const { createWorker } = require("tesseract.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Document = require("../models/Document");
const path = require("path");
const fs = require("fs").promises;
const pdf = require("pdf-parse");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Initialize Tesseract worker
const initTesseract = async () => {
  const worker = await createWorker("eng");
  return worker;
};

// Process document with OCR
const processDocument = async (filePath) => {
  const fileExt = path.extname(filePath).toLowerCase();

  // Handle PDF files
  if (fileExt === ".pdf") {
    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await pdf(dataBuffer);
    return pdfData.text;
  }

  // Handle image files with Tesseract
  const worker = await initTesseract();
  try {
    const {
      data: { text },
    } = await worker.recognize(filePath);
    return text;
  } finally {
    await worker.terminate();
  }
};

// Generate AI prompt and extract key-value pairs
const generatePromptAndExtract = async (text) => {
  const prompt = `You are a document processing assistant. Extract key-value pairs from the following text and return ONLY a JSON object. Do not include any markdown formatting, code blocks, or additional text. The response should be a valid JSON object where keys are the field names and values are the extracted information.

Text to process:
${text}

Return ONLY a JSON object like this example:
{
  "invoice_number": "INV-001",
  "date": "2024-03-20",
  "total_amount": "1000.00"
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text().trim();

    // Clean the response text to ensure it's valid JSON
    const cleanedResponse = responseText
      .replace(/```json\n?/g, "") // Remove ```json if present
      .replace(/```\n?/g, "") // Remove ``` if present
      .trim(); // Remove extra whitespace

    const jsonResponse = JSON.parse(cleanedResponse);

    return {
      prompt,
      keyValuePairs: jsonResponse,
    };
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    console.error("Raw response:", error.response?.text());
    throw new Error("Failed to process document with AI");
  }
};

// Controller functions
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const extractedText = await processDocument(filePath);
    const { prompt, keyValuePairs } = await generatePromptAndExtract(
      extractedText
    );

    const document = new Document({
      fileName: req.file.originalname,
      fileType: path.extname(req.file.originalname),
      extractedText,
      documentType: "invoice", // This should be determined dynamically
      aiPrompt: prompt,
      keyValuePairs,
    });

    await document.save();
    await fs.unlink(filePath); // Clean up temporary file

    res.status(201).json(document);
  } catch (error) {
    console.error("Error processing document:", error);
    res.status(500).json({ message: "Error processing document" });
  }
};

exports.processBatch = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const results = [];
    for (const file of req.files) {
      const filePath = file.path;
      const extractedText = await processDocument(filePath);
      const { prompt, keyValuePairs } = await generatePromptAndExtract(
        extractedText
      );

      const document = new Document({
        fileName: file.originalname,
        fileType: path.extname(file.originalname),
        extractedText,
        documentType: "invoice", // This should be determined dynamically
        aiPrompt: prompt,
        keyValuePairs,
      });

      await document.save();
      await fs.unlink(filePath); // Clean up temporary file
      results.push(document);
    }

    res.status(201).json(results);
  } catch (error) {
    console.error("Error processing batch:", error);
    res.status(500).json({ message: "Error processing batch" });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching documents" });
  }
};
