// Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <img src="../images/on-air.png" className="logo" alt="Podcast Icon" />
      <h2 className="header--title">Tshidiso's Podcast App</h2>
      {/* <button onClick={() => navigate("/favourites")}>Favourites</button> */}
    </header>
  );
}
