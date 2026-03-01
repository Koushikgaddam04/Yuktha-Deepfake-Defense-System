import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import KnowMorePage from './pages/KnowMorePage';
import ArchitecturePage from './pages/ArchitecturePage';
import TestPage from './pages/TestPage';

function App() {
  return (
    <Router>
      <div className="app-background"></div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/know-more" element={<KnowMorePage />} />
        <Route path="/architecture" element={<ArchitecturePage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
