import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Project from "./pages/Project";
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects/:projectId" element={<Project />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

