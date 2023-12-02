// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import ShowPreviews from "./components/ShowPreviews.jsx";
import Seasons from "./components/Seasons.jsx";
import Episodes from "./components/Episodes.jsx"; // Import Episodes component

function App() {
  return (
    <div>
      <Header />
      <Routes>
        {/* Route for the Seasons component */}
        <Route
          path="/seasons/:id"
          element={<Seasons show={location.state && location.state.show} />}
        >
          {/* Nested route for the Episodes component */}
          <Route path="episodes/:seasonNumber" element={<Episodes />} />
        </Route>

        {/* Default route for the ShowPreviews component */}
        <Route path="/" element={<ShowPreviews />} />
      </Routes>
    </div>
  );
}

export default App;
