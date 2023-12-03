//Episodes.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Favourites from "./Favourites"; // Import the Favourites component

const Episodes = () => {
  const [seasonData, setSeasonData] = useState(null);
  const [favoriteEpisodes, setFavoriteEpisodes] = useState(() => {
    const storedFavorites = localStorage.getItem("favoriteEpisodes");
    const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    return Array.isArray(parsedFavorites) ? parsedFavorites : [];
  });

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

  const handleToggleFavorite = (episodeId, episode) => {
    const selectedEpisodeData = seasonData.seasons
      .flatMap((season) => season.episodes)
      .find((e) => e.episode === episodeId);
    console.log(episodeId);
    32;

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
      setFavoriteEpisodes((prevFavorites) => {
        const updatedFavorites = [
          ...prevFavorites,
          { compoundKey, title: episode.title, file: episode.file },
        ];
        localStorage.setItem(
          "favoriteEpisodes",
          JSON.stringify(updatedFavorites)
        );
        return updatedFavorites;
      });
    }
  };

  return (
    <div>
      <h3>
        {show && show.title} - Season {selectedSeasonData.season} Episodes
      </h3>
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

Episodes.propTypes = {
  show: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    // Add other required properties of the show object
  }),
};

export default Episodes;
