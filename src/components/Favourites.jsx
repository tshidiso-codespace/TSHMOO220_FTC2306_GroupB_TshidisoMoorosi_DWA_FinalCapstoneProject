// Favourites.jsx
import React from "react";
import PropTypes from "prop-types";

/**
 * The `Favourites` component displays a list of favorite episodes, providing sorting options
 * and the ability to toggle the favorite status for each episode. It includes an audio player for
 * each favorite episode. The component is typically used within the context of a podcast app to
 * manage and display the user's favorite episodes.
 *
 * @component
 * @example
 * // Usage within another component
 * import Favourites from "./Favourites";
 * // ...
 * <Favourites favoriteEpisodes={favoriteEpisodes} handleToggleFavorite={handleToggleFavorite} />
 */
const Favourites = ({ favoriteEpisodes = [], handleToggleFavorite }) => {
  // State variable for managing the selected sort option
  const [selectedSort, setSelectedSort] = React.useState("title"); // Default sort by title

  // Event handler for changing the sort option
  const handleSortChange = (event) => {
    setSelectedSort(event.target.value);
  };

  // Function to get the sorted list of favorite episodes based on the selected sort option
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

  // Render the component
  return (
    <div>
      {/* Dropdown for selecting the sort option */}
      <div className="sort-dropdown">
        <label htmlFor="sort">Sort By: </label>
        <select id="sort" value={selectedSort} onChange={handleSortChange}>
          <option value="titleAZ">Title (A-Z)</option>
          <option value="titleZA">Title (Z-A)</option>
          <option value="dateAsc">Date Updated (Asc)</option>
          <option value="dateDesc">Date Updated (Desc)</option>
        </select>
      </div>

      {/* Title indicating the section is for displaying favorites */}
      <h2>Favourites</h2>

      {/* Render each favorite episode with details, checkbox, and audio player */}
      <div>
        {getSortedEpisodes().map((fav) => (
          <div className="episodes-container" key={fav.compoundKey}>
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

// PropTypes for type-checking the props
Favourites.propTypes = {
  favoriteEpisodes: PropTypes.array,
  handleToggleFavorite: PropTypes.func.isRequired,
};

export default Favourites;
