import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DocumentUpload from "./components/DocumentUpload";
import DocumentList from "./components/DocumentList";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<DocumentUpload />} />
            <Route path="/documents" element={<DocumentList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
