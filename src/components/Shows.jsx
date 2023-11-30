import React from "react";
import { genres } from "../data.jsx";

const ShowList = () => {
  const [allShows, setAllShows] = React.useState([]);

  React.useEffect(() => {
    fetch("https://podcast-api.netlify.app/shows")
      .then((res) => res.json())
      .then((data) => setAllShows(data));
  }, []);

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
        </div>
      ))}
    </div>
  );
};

export default ShowList;
