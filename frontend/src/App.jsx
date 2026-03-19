import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientPage from './pages/PatientPage';
import AdminDashboard from './pages/AdminDashboard';
import DisplayPage from './pages/DisplayPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PatientPage />} />
        <Route path="/admin" element={<AdminDashboard />} /> 
        <Route path="/display" element={<DisplayPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;