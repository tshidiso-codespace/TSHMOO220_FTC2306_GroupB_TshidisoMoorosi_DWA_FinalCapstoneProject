import React from "react";
import { genres } from "../data.jsx";
import Seasons from "./Seasons.jsx";
import { useNavigate } from "react-router-dom";

const ShowPreviews = () => {
  const [allShows, setAllShows] = React.useState([]);
  const navigate = useNavigate();
  const [selectedShow, setSelectedShow] = React.useState(null);
  const [selectedSort, setSelectedSort] = React.useState("title"); // Default sort by title

  React.useEffect(() => {
    fetch("https://podcast-api.netlify.app/shows")
      .then((res) => res.json())
      .then((data) => setAllShows(data));
  }, []);

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
      {getSortedShows().map((show) => (
        <div key={show.id}>
          <h3>{show.title}</h3>
          <img src={show.image} alt={`${show.title} Preview`} />
          <p>Seasons: {show.seasons}</p>
          <p>Last Updated: {new Date(show.updated).toLocaleDateString()}</p>
          <p>
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
