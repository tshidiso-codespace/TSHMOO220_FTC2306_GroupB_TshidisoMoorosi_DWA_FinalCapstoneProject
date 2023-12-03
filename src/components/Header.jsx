// Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <h2 className="header--title">Tshidiso's Podcast App</h2>
      <button onClick={() => navigate("/favourites")}>Favourites</button>
      <img
        src="../images/magnifying-glass.png"
        className="search--icon"
        alt="Search Icon"
      />
    </header>
  );
}
