import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const Seasons = () => {
  const [seasonData, setSeasonData] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);

  const { id } = useParams();
  const location = useLocation();
  const show = location.state && location.state.show;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://podcast-api.netlify.app/id/${show.id}`
        );
        const data = await response.json();
        setSeasonData(data);
      } catch (error) {
        console.error("Error fetching season data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleSeasonSelect = (seasonNumber) => {
    setSelectedSeason(seasonNumber);
  };

  if (!seasonData) {
    return <div>Loading...</div>; // Add a loading state if needed
  }

  return (
    <div>
      <h3>{show.title} - Seasons</h3>
      {seasonData.seasons.map((season) => (
        <div key={season.season}>
          <img
            src={season.image}
            alt={`${show.title} Season ${season.season}`}
          />
          <p>Season {season.season}</p>
          <p>Episodes: {season.episodes.length}</p>
          <button onClick={() => handleSeasonSelect(season.season)}>
            View Episodes
          </button>
        </div>
      ))}
      {selectedSeason && (
        <div>
          <h3>
            {show.title} - Season {selectedSeason}
          </h3>
          {seasonData.seasons
            .find((season) => season.season === selectedSeason)
            .episodes.map((episode) => (
              <div key={episode.episode}>
                <h4>{episode.title}</h4>
                <p>{episode.description}</p>
                {/* Include audio player for the episode */}
                {/* <audio controls>
                  <source src={episode.file} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio> */}
              </div>
            ))}
          <button onClick={() => handleSeasonSelect(null)}>
            Go Back to Seasons
          </button>
        </div>
      )}
    </div>
  );
};

Seasons.propTypes = {
  show: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    // Add other required properties of the show object
  }).isRequired,
};

export default Seasons;
