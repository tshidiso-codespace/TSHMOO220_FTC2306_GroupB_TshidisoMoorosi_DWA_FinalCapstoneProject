import React, { useState, useEffect } from "react";

const ShowDetails = ({ match }) => {
  const [showDetails, setShowDetails] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);

  useEffect(() => {
    // Fetch show details based on the show ID from the URL
    const fetchShowDetails = async () => {
      try {
        const response = await fetch(
          `https://podcast-api.netlify.app/id/${match.params.id}`
        );
        const data = await response.json();
        setShowDetails(data);
        // Default to the first season initially
        setSelectedSeason(data.seasons[0].season);
      } catch (error) {
        console.error("Error fetching show details:", error);
      }
    };

    fetchShowDetails();
  }, [match.params.id]);

  const handleSeasonSelect = (seasonNumber) => {
    setSelectedSeason(seasonNumber);
  };

  if (!showDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{showDetails.title}</h2>
      <p>{showDetails.description}</p>

      {/* Display season previews */}
      {showDetails.seasons.map((season) => (
        <div key={season.season}>
          <img
            src={season.image}
            alt={`${showDetails.title} Season ${season.season} Preview`}
          />
          <p>Season {season.season}</p>
          <p>Episodes: {season.episodes.length}</p>
          <button onClick={() => handleSeasonSelect(season.season)}>
            View Season
          </button>
        </div>
      ))}

      {/* Display selected season's episodes */}
      {selectedSeason && (
        <div>
          <h3>Season {selectedSeason} Episodes</h3>
          {showDetails.seasons
            .find((season) => season.season === selectedSeason)
            .episodes.map((episode) => (
              <div key={episode.episode}>
                <p>{episode.title}</p>
                <p>{episode.description}</p>
                <audio controls>
                  <source src={episode.file} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ))}
          <button onClick={() => setSelectedSeason(null)}>
            Go Back to Show
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowDetails;
