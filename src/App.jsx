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
      {/* Main container for the entire app */}
      <div className="app">
        {/* Header component displaying the app title and navigation button */}
        <Header />

        {/* Routing setup using React Router's `Routes` component */}
        <Routes>
          {/* Route for displaying the user's favorite episodes */}
          <Route path="/favourites" element={<Favourites />} />

          {/* Route for displaying seasons and episodes based on the show ID */}
          <Route path="/seasons/:id/*" element={<Seasons />} />

          {/* Route for displaying individual episodes */}
          <Route path="/episodes/:seasonNumber" element={<Episodes />} />

          {/* Default route for displaying show previews */}
          <Route path="/" element={<ShowPreviews />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
