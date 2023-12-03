// Favourites.jsx
import React from "react";
import PropTypes from "prop-types";

const Favourites = ({ favoriteEpisodes = [], handleToggleFavorite }) => {
  return (
    <div>
      <h2>Favourites</h2>
      <div>
        {favoriteEpisodes.map((fav) => (
          <div key={fav.compoundKey}>
            <h4>{fav.title}</h4>
            <p>{fav.description}</p>
            <input
              type="checkbox"
              checked={true} // Set checked based on your logic
              onChange={() => handleToggleFavorite(fav)}
            />
            {/* Include audio player for the episode */}
            <audio controls>
              <source src={fav.file} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
};

Favourites.propTypes = {
  favoriteEpisodes: PropTypes.array,
  handleToggleFavorite: PropTypes.func.isRequired,
};

export default Favourites;
