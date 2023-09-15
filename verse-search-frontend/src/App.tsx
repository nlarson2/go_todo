import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useIsMobile } from './hooks/Windows';
import './App.css';

const App: React.FC = () => {
  const isMobile = useIsMobile(768);


  function DisplayLeft() {
    return (
      <>
        {
          isMobile == true ?
            <div>NAV BAR</div>
            :
            <>  </>
        }
        test stuff
      </>
    )
  }
  function DisplayRight() {
    return (
      <>
        {
          isMobile == true ?
            <div>NAV BAR</div>
            :
            <>  </>
        }
        test stuff right side
      </>
    )
  }

  return (
    <>
      <div id="container">
        {!isMobile ?
          <>
            <div id="left-side">
              {DisplayLeft()}
            </div>
            <div id="right-side">
              {DisplayRight()}
            </div>
          </>
          :
          <>
            <Router>
              <Routes>
                <Route path='/' element={DisplayLeft()} />
                <Route path='/search' element={DisplayRight()} />
              </Routes>
            </Router>
          </>
        }
      </div >
    </>
  )
}

export default App
