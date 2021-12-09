import { Routes, Route, } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import "bootswatch/dist/solar/bootstrap.min.css";
import { BaseURLContext } from "./services/baseURL-Context";
import Nav from './Components/Nav/Nav';
import Map from './Components/Map/Map';
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login"
import Contributor from "./Components/Contributor/Contributor";
import './App.css';

function App() {

  const [baseURL, setBaseURL] = useState("http://127.0.0.1:8000/api/");
  const baseURLValue = { baseURL, setBaseURL };

  return (
    <BaseURLContext.Provider value={baseURLValue}>
      <div className="App">
        <div className="route-container">
          <div><Nav /></div>
          <div></div>
          <Routes>
            <Route path="/" exact element={<Map />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contributor" element={<Contributor />} />
          </Routes>
        </div>
      </div>
    </BaseURLContext.Provider>
  );
}

export default App;
