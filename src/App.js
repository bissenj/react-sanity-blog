//import logo from './logo.svg';
import './App.css';

import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import AllPosts from "./components/AllPosts"
import OnePost from "./components/OnePost.js"

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<AllPosts />} />          
          <Route path="/:slug" element={<OnePost />} /> 
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
