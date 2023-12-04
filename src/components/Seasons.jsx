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

/**
 * The `Seasons` component displays information about the seasons of a podcast show.
 * It includes a list of seasons with details such as season number, episode count,
 * and a button to navigate to the episodes of a selected season.
 *
 * @component
 * @example
 * // Usage within another component or route
 * import Seasons from "./Seasons";
 * // ...
 * <Seasons />
 */
const Seasons = () => {
  // State variable for managing season data
  const [seasonData, setSeasonData] = useState(null);

  // Extract show id from the URL parameters
  const { id } = useParams();

  // Extract show and location information using React Router hooks
  const location = useLocation();
  const navigate = useNavigate();
  const show = location.state && location.state.show;

  // Fetch season data for the specified show on component mount or show change
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

  // Handle selection of a season and navigate to the associated Episodes component
  const handleSeasonSelect = (seasonNumber) => {
    navigate(`/seasons/${id}/episodes/${seasonNumber}`, {
      state: { show, seasonNumber },
    });
  };

  // Render loading state if season data is not available
  if (!seasonData) {
    return <div>Loading...</div>;
  }

  // Render the component
  return (
    <div className="seasons-container">
      {/* Display show title and header */}
      <h3>{show && show.title} - Seasons</h3>

      {/* Define routes for the Seasons and Episodes components */}
      <Routes>
        <Route path="/" element={<div>Default Season View</div>} />
        <Route path="episodes/:seasonNumber" element={<Episodes />} />
      </Routes>

      {/* Render season details and buttons for each season */}
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

// PropTypes for type-checking the 'show' prop
Seasons.propTypes = {
  show: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    // Add other required properties of the show object
  }),
};

export default Seasons;
