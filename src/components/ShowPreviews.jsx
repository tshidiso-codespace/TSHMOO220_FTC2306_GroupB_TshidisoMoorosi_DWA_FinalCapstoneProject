import React from "react";
import { genres } from "../data.jsx";
import Seasons from "./Seasons.jsx";
import { useNavigate } from "react-router-dom";

/**
 * The `ShowPreviews` component renders a list of podcast shows and allows users to
 * interact with and navigate through the available shows. Users can view show details
 * and select a show to see its associated seasons.
 *
 * @component
 * @example
 * // Usage within another component or route
 * import ShowPreviews from "./ShowPreviews";
 * // ...
 * <ShowPreviews />
 */
const ShowPreviews = () => {
  // State variables for managing show data
  const [allShows, setAllShows] = React.useState([]);
  const navigate = useNavigate();
  const [selectedShow, setSelectedShow] = React.useState(null);
  const [selectedSort, setSelectedSort] = React.useState("title"); // Default sort by title
  const [filteredShows, setFilteredShows] = React.useState([]);
  const [selectedGenre, setSelectedGenre] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = React.useState(false);

  // Fetch show data from external API
  React.useEffect(() => {
    fetch("https://podcast-api.netlify.app/shows")
      .then((res) => res.json())
      .then((data) => setAllShows(data));
  }, []);

  React.useEffect(() => {
    // Apply filters when either genre or searchQuery changes
    const filtered = getSortedShows().filter((show) => {
      const matchesGenre = selectedGenre
        ? show.genres.includes(selectedGenre)
        : true;
      const matchesSearch = show.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesGenre && matchesSearch;
    });
    setFilteredShows(filtered);
  }, [selectedGenre, searchQuery, allShows]);

  const handleShowSelect = (showId) => {
    const selectedShow = allShows.find((show) => show.id === showId);
    if (selectedShow) {
      // Use navigate to change the URL and navigate to the Seasons component
      navigate(`/seasons/${showId}`, { state: { show: selectedShow } });
    }
  };

  const handleSortChange = (event) => {
    setSelectedSort(event.target.value);
  };

  const getSortedShows = () => {
    switch (selectedSort) {
      case "titleAZ":
        return [...allShows].sort((a, b) => a.title.localeCompare(b.title));
      case "titleZA":
        return [...allShows].sort((a, b) => b.title.localeCompare(a.title));
      case "dateAsc":
        return [...allShows].sort((a, b) => a.updated - b.updated);
      case "dateDesc":
        return [...allShows].sort((a, b) => b.updated - a.updated);
      default:
        return allShows;
    }
  };

  const openSearchOverlay = () => {
    setIsSearchOverlayOpen(true);
  };

  const closeSearchOverlay = () => {
    setIsSearchOverlayOpen(false);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Add logic for handling the search form submission if needed
    closeSearchOverlay();
  };

  return (
    <div className="container">
      <div className="sort-dropdown">
        <label htmlFor="sort">Sort By: </label>
        <select id="sort" value={selectedSort} onChange={handleSortChange}>
          <option value="titleAZ">Title (A-Z)</option>
          <option value="titleZA">Title (Z-A)</option>
          <option value="dateAsc">Date Updated (Asc)</option>
          <option value="dateDesc">Date Updated (Desc)</option>
        </select>
      </div>

      {/* Magnifying glass icon to open search overlay */}
      <img
        src="../images/magnifying-glass.png"
        className="search--icon"
        alt="Search Icon"
        onClick={openSearchOverlay}
      />

      {/* Filter by genre */}
      <div className="genre-filter">
        <label htmlFor="genre">Filter By Genre: </label>
        <select
          id="genre"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          {Object.keys(genres).map((genreId) => (
            <option key={genreId} value={genreId}>
              {genres[genreId]}
            </option>
          ))}
        </select>
      </div>

      {/* Search by title */}
      <div className="search-input">
        <label htmlFor="search">Search By Title: </label>
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Search overlay */}
      {isSearchOverlayOpen && (
        <div className="overlay" data-search-overlay>
          <div className="overlay__content">
            <form className="overlay__form" onSubmit={handleSearchSubmit}>
              <label className="overlay__field">
                <div className="overlay__label">Title</div>
                <input
                  className="overlay__input"
                  data-search-title
                  name="title"
                  placeholder="Any"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </label>

              <label className="overlay__field">
                <div className="overlay__label">Genre</div>
                <select
                  className="overlay__input overlay__input_select"
                  data-search-genres
                  name="genre"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                >
                  <option value="">All Genres</option>
                  {Object.keys(genres).map((genreId) => (
                    <option key={genreId} value={genreId}>
                      {genres[genreId]}
                    </option>
                  ))}
                </select>
              </label>

              {/* Add similar logic for Author filter if needed */}

              <div className="overlay__row">
                <button
                  className="overlay__button"
                  onClick={closeSearchOverlay}
                  data-search-cancel
                >
                  Cancel
                </button>
                <button
                  className="overlay__button overlay__button_primary"
                  type="submit"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Render filtered shows */}
      {filteredShows.map((show) => (
        <div className="show--preview" key={show.id}>
          <h3 className="show--title">{show.title}</h3>
          <img
            className="show--image"
            src={show.image}
            alt={`${show.title} Preview`}
          />
          <p className="show--seasons">Seasons: {show.seasons}</p>
          <p className="show--date">
            Last Updated: {new Date(show.updated).toLocaleDateString()}
          </p>
          <p className="show--genre">
            Genres: {show.genres.map((genreId) => genres[genreId]).join(", ")}
          </p>
          <button onClick={() => handleShowSelect(show.id)}>
            View Seasons
          </button>
        </div>
      ))}
      {selectedShow && <Seasons show={selectedShow} />}

      {/* Render shows based on selected sort option */}
      {getSortedShows().map((show) => (
        <div className="show--preview" key={show.id}>
          <h3 className="show--title">{show.title}</h3>
          <img
            className="show--image"
            src={show.image}
            alt={`${show.title} Preview`}
          />
          <p className="show--seasons">Seasons: {show.seasons}</p>
          <p className="show--date">
            Last Updated: {new Date(show.updated).toLocaleDateString()}
          </p>
          <p className="show--genre">
            Genres: {show.genres.map((genreId) => genres[genreId]).join(", ")}
          </p>
          <button onClick={() => handleShowSelect(show.id)}>
            View Seasons
          </button>
        </div>
      ))}
      {selectedShow && <Seasons show={selectedShow} />}
    </div>
  );
};

export default ShowPreviews;
