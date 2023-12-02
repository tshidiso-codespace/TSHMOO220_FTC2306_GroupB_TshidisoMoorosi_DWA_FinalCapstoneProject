// Seasons.jsx
import React, { useState, useEffect } from "react";
import {
  useParams,
  useLocation,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import PropTypes from "prop-types";
import Episodes from "./Episodes";

const Seasons = () => {
  const [seasonData, setSeasonData] = useState(null);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const show = location.state && location.state.show;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (show && show.id) {
          const response = await fetch(
            `https://podcast-api.netlify.app/id/${show.id}`
          );
          const data = await response.json();
          setSeasonData(data);
        }
      } catch (error) {
        console.error("Error fetching season data:", error);
      }
    };

    fetchData();
  }, [show]);

  const handleSeasonSelect = (seasonNumber) => {
    // Use navigate to change the URL and navigate to the Episodes component
    navigate(`/seasons/${id}/episodes/${seasonNumber}`, {
      state: { show, seasonNumber },
    });
  };

  if (!seasonData) {
    return <div>Loading...</div>; // Add a loading state if needed
  }

  return (
    <div>
      <h3>{show && show.title} - Seasons</h3>

      <Routes>
        {/* Route for the Seasons component */}
        <Route path="/" element={<div>Default Season View</div>} />

        {/* Nested route for the Episodes component */}
        <Route path="episodes/:seasonNumber" element={<Episodes />} />
      </Routes>

      {(!location.pathname.includes("/episodes/") || !seasonData) &&
        seasonData.seasons.map((season) => (
          <div key={season.season}>
            <img
              src={season.image}
              alt={show ? `${show.title} Season ${season.season}` : "Season"}
            />
            <p>Season {season.season}</p>
            <p>Episodes: {season.episodes.length}</p>
            <button onClick={() => handleSeasonSelect(season.season)}>
              View Episodes
            </button>
          </div>
        ))}
    </div>
  );
};

Seasons.propTypes = {
  show: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    // Add other required properties of the show object
  }),
};

export default Seasons;
