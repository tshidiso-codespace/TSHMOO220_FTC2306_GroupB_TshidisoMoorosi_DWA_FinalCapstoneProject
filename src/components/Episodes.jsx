//Episodes.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Favourites from "./Favourites"; // Import the Favourites component

/**
 * The `Episodes` component displays a list of episodes for a specific season of a podcast show.
 * It allows users to mark episodes as favorites and includes an audio player for each episode.
 * The component also provides a button to navigate back to the Seasons component.
 *
 * @component
 * @example
 * // Usage within another component or route
 * import Episodes from "./Episodes";
 * // ...
 * <Episodes />
 */
const Episodes = () => {
  // State variables for managing season data and favorite episodes
  const [seasonData, setSeasonData] = useState(null);
  const [favoriteEpisodes, setFavoriteEpisodes] = useState(() => {
    const storedFavorites = localStorage.getItem("favoriteEpisodes");
    const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    return Array.isArray(parsedFavorites) ? parsedFavorites : [];
  });

  // Extract season number and show id from the URL parameters
  const { seasonNumber, id } = useParams();

  // Extract show information from the React Router location state
  const { show } = useLocation().state;

  // Navigation function to move back to the Seasons component
  const navigate = useNavigate();

  // Fetch season data for the specified show and season number
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

  // Render loading state if season data is not available
  if (!seasonData) {
    return <div>Loading...</div>;
  }

  // Find the selected season data based on the provided season number
  const selectedSeasonData = seasonData.seasons.find(
    (season) => season.season === parseInt(seasonNumber)
  );

  // Render message if the selected season is not found
  if (!selectedSeasonData) {
    return <div>Season not found...</div>;
  }

  // Toggle favorite status for an episode and update the favorites list
  const handleToggleFavorite = (episodeId, episode) => {
    const selectedEpisodeData = seasonData.seasons
      .flatMap((season) => season.episodes)
      .find((e) => e.episode === episodeId);

    if (!selectedEpisodeData) {
      console.error("Selected episode not found.");
      return;
    }

    const compoundKey = `${show.id}_${selectedSeasonData.season}_${selectedEpisodeData.episode}`;
    const isFavorite = favoriteEpisodes.some(
      (fav) => fav.compoundKey === compoundKey
    );

    if (isFavorite) {
      // Remove from favorites
      setFavoriteEpisodes((prevFavorites) => {
        const updatedFavorites = prevFavorites.filter(
          (fav) => fav.compoundKey !== compoundKey
        );
        localStorage.setItem(
          "favoriteEpisodes",
          JSON.stringify(updatedFavorites)
        );
        return updatedFavorites;
      });
    } else {
      // Add to favorites
      const currentDate = new Date();
      setFavoriteEpisodes((prevFavorites) => {
        const updatedFavorites = [
          ...prevFavorites,
          {
            compoundKey,
            title: episode.title,
            file: episode.file,
            updated: currentDate.getTime(),
          },
        ];
        localStorage.setItem(
          "favoriteEpisodes",
          JSON.stringify(updatedFavorites)
        );
        return updatedFavorites;
      });
    }
  };

  // Render the component
  return (
    <div className="episodes-container">
      <h3>
        {show && show.title} - Season {selectedSeasonData.season} Episodes
      </h3>

      {/* Render each episode with details, favorite toggle, and audio player */}
      {selectedSeasonData.episodes.map((episode) => {
        const compoundKey = `${show.id}_${selectedSeasonData.season}_${episode.episode}`;
        return (
          <div key={compoundKey}>
            <h4>{episode.title}</h4>
            <p>{episode.description}</p>
            <input
              type="checkbox"
              checked={favoriteEpisodes.some(
                (fav) => fav.compoundKey === compoundKey
              )}
              onChange={() => handleToggleFavorite(episode.episode, episode)}
            />
            {/* Include audio player for the episode */}
            <audio controls>
              <source src={episode.file} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      })}

      {/* Button to navigate back to the Seasons component */}
      <button onClick={() => navigate(`/seasons/${id}`)}>
        Go Back to Seasons
      </button>

      {/* Pass handleToggleFavorite function to Favourites component */}
      <Favourites
        favoriteEpisodes={favoriteEpisodes}
        handleToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
};

// PropTypes for type-checking the 'show' prop
Episodes.propTypes = {
  show: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    // Add other required properties of the show object
  }),
};

export default Episodes;
