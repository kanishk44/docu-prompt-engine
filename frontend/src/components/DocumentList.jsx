import { useState, useEffect } from "react";
import api from "../api/axios";

function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/api/documents");
      setDocuments(response.data);
      setError(null);
    } catch (err) {
      setError("Error fetching documents");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Processed Documents</h2>

      {documents.length === 0 ? (
        <p className="text-gray-600 text-center py-8">
          No documents have been processed yet.
        </p>
      ) : (
        <div className="space-y-6">
          {documents.map((doc) => (
            <div key={doc._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{doc.fileName}</h3>
                  <p className="text-sm text-gray-500">
                    Processed on {new Date(doc.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {doc.documentType}
                </span>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Extracted Text:</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {doc.extractedText}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">AI Prompt:</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{doc.aiPrompt}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Key-Value Pairs:</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(doc.keyValuePairs).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="font-medium text-gray-600">
                          {key}:
                        </span>
                        <span className="ml-2 text-gray-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DocumentList;
