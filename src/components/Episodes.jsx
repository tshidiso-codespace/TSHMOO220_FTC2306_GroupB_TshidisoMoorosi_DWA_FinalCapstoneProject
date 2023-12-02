// Episodes.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const Episodes = () => {
  const [seasonData, setSeasonData] = useState(null);

  const { seasonNumber, id } = useParams();
  const { show } = useLocation().state;

  const navigate = useNavigate();

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
  }, [show, seasonNumber]);

  if (!seasonData) {
    return <div>Loading...</div>; // Add a loading state if needed
  }

  const selectedSeasonData = seasonData.seasons.find(
    (season) => season.season === parseInt(seasonNumber)
  );

  if (!selectedSeasonData) {
    return <div>Season not found...</div>;
  }

  return (
    <div>
      <h3>
        {show && show.title} - Season {selectedSeasonData.season} Episodes
      </h3>
      {selectedSeasonData.episodes.map((episode) => (
        <div key={episode.episode}>
          <h4>{episode.title}</h4>
          <p>{episode.description}</p>
          {/* Include audio player for the episode */}
          <audio controls>
            <source src={episode.file} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
      <button onClick={() => navigate(`/seasons/${id}`)}>
        Go Back to Seasons
      </button>
    </div>
  );
};

Episodes.propTypes = {
  show: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    // Add other required properties of the show object
  }).isRequired,
};

export default Episodes;
