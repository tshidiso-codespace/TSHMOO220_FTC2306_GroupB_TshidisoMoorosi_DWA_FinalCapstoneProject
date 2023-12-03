// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import ShowPreviews from "./components/ShowPreviews.jsx";
import Seasons from "./components/Seasons.jsx";
import Episodes from "./components/Episodes.jsx";
import Favourites from "./components/Favourites.jsx";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          {/* Define the Favourites route at the top level */}
          <Route path="/favourites" element={<Favourites />} />

          {/* Update the parent route path with a trailing "*" */}
          <Route path="/seasons/:id/*" element={<Seasons />} />

          {/* Other routes remain the same */}
          <Route path="/episodes/:seasonNumber" element={<Episodes />} />

          {/* Default route */}
          <Route path="/" element={<ShowPreviews />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
