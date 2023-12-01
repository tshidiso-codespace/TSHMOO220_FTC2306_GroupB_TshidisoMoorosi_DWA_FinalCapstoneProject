// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import ShowPreviews from "./components/ShowPreviews.jsx";
import Seasons from "./components/Seasons.jsx";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/seasons/:id" element={<Seasons />} />
        <Route path="/" element={<ShowPreviews />} />
      </Routes>
    </div>
  );
}

export default App;
