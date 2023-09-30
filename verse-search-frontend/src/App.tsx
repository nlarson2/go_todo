import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useIsMobile } from "./hooks/Windows";

import "./App.css";

import Home from "./pages/Home";
import Search from "./pages/Search";

const App: React.FC = () => {
  const isMobile = useIsMobile(800);
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home isMobile={isMobile} />} />
          <Route path="/search" element={<Search isMobile={isMobile} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
