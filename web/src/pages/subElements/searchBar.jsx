import React, { useState } from "react";
import "../../styles/SearchBarStyles.css";


export default function SearchBar({ onFilterTextChange }) {
  const [searchText, setSearchText] = useState(""); // State for search text

  const handleInputChange = (e) => {
    const text = e.target.value.toLowerCase();
    e.preventDefault();
    setSearchText(text);        // Update local state
    onFilterTextChange(text);   // Pass the search text to the parent component
  };

  return (
    <div className="bodysearchbar">
      <div className="barOfSearch">
        <form>
          <input className="inputsearch"
            type="text"
            value={searchText}
            placeholder="Search..."
            onChange={handleInputChange} 
          />
        </form>
      </div>
    </div>
  );
}