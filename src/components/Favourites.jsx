// Favourites.jsx
import React from "react";
import PropTypes from "prop-types";

const Favourites = ({ favoriteEpisodes = [], handleToggleFavorite }) => {
  const [selectedSort, setSelectedSort] = React.useState("title"); // Default sort by title

  const handleSortChange = (event) => {
    setSelectedSort(event.target.value);
  };

  const getSortedEpisodes = () => {
    switch (selectedSort) {
      case "titleAZ":
        return [...favoriteEpisodes].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
      case "titleZA":
        return [...favoriteEpisodes].sort((a, b) =>
          b.title.localeCompare(a.title)
        );
      case "dateAsc":
        return [...favoriteEpisodes].sort((a, b) => a.updated - b.updated);
      case "dateDesc":
        return [...favoriteEpisodes].sort((a, b) => b.updated - a.updated);
      default:
        return favoriteEpisodes;
    }
  };

  return (
    <div>
      <div className="sort-dropdown">
        <label htmlFor="sort">Sort By: </label>
        <select id="sort" value={selectedSort} onChange={handleSortChange}>
          <option value="titleAZ">Title (A-Z)</option>
          <option value="titleZA">Title (Z-A)</option>
          <option value="dateAsc">Date Updated (Asc)</option>
          <option value="dateDesc">Date Updated (Desc)</option>
        </select>
      </div>
      <h2>Favourites</h2>
      <div>
        {favoriteEpisodes.map((fav) => (
          <div key={fav.compoundKey}>
            <h4>{fav.title}</h4>
            <p>{fav.description}</p>
            <p>Added on: {new Date(fav.updated).toLocaleString()}</p>
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
