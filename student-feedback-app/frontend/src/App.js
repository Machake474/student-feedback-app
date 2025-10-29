import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SubmitFeedback from './pages/SubmitFeedback';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        {/* Top Header Bar */}
        <header className="bg-white border-bottom shadow-sm py-3">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col">
                <nav className="d-flex gap-4">
                  <NavLink to="/dashboard" className="nav-link text-dark fw-medium px-3 py-2 rounded">
                    Dashboard
                  </NavLink>
                  <NavLink to="/submit" className="nav-link text-dark fw-medium px-3 py-2 rounded">
                    Submit Feedback
                  </NavLink>
                  <NavLink to="/reports" className="nav-link text-dark fw-medium px-3 py-2 rounded">
                    View Reports
                  </NavLink>
                </nav>
              </div>
              <div className="col-auto">
                <span className="navbar-brand fw-bold fs-3 text-primary">Student Feedback Portal</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow-1 bg-light">
          <div className="container-fluid h-100">
            <div className="row h-100">
              <div className="col-12 py-4">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/submit" element={<SubmitFeedback />} />
                  <Route path="/reports" element={<Reports />} />
                </Routes>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-dark text-white text-center py-3">
          <div className="container">
            <p className="mb-0">© 2025 Student Feedback Portal</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;