import React from "react";
import Button from "@components/Button/Button"; 
import "./SearchBar.css";

const SearchBar = () => {
  return (
    <div className="search-bar">
      <input type="date" placeholder="Aankomst" />
      <input type="date" placeholder="Vertrek" />
      <select>
        <option>1 Persoon</option>
        <option>2 Personen</option>
        <option>3 Personen</option>
        <option>4 Personen</option>
      </select>
      <Button className="search-button">Zoeken</Button>
    </div>
  );
};

export default SearchBar;
