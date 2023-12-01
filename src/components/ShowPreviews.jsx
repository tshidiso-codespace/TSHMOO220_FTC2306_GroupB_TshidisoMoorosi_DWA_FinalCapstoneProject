import React from "react";
import { genres } from "../data.jsx";
import Seasons from "./Seasons.jsx";
import { useNavigate } from "react-router-dom";

const ShowPreviews = () => {
  const [allShows, setAllShows] = React.useState([]);
  const navigate = useNavigate();
  const [selectedShow, setSelectedShow] = React.useState(null);

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

  return (
    <div>
      {allShows.map((show) => (
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
