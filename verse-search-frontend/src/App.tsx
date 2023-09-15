import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useIsMobile } from './hooks/Windows';
import './App.css';

import Home from './pages/Home';
import Search from './pages/Search';


const App: React.FC = () => {
  const isMobile = useIsMobile(800);



  return (
    <Router>
      <div className="container">
        {!isMobile ?
          <>
            <div id="left-side">
              <Home />
            </div>
            <div id="right-side">
              <Search />
            </div>
          </>
          :
          <>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/search' element={<Search />} />
            </Routes>
          </>
        }
      </div >
    </Router >
  )
}

export default App
