const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  extractedText: {
    type: String,
    required: true,
  },
  documentType: {
    type: String,
    required: true,
  },
  aiPrompt: {
    type: String,
    required: true,
  },
  keyValuePairs: {
    type: Map,
    of: String,
    default: new Map(),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Document", documentSchema);
