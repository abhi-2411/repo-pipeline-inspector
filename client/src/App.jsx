import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import AnalysisPage from './pages/AnalysisPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/analyses/:id" element={<AnalysisPage />} />
    </Routes>
  );
}
