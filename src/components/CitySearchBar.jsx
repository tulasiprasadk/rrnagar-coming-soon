import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CitySearchBar.css";

export default function CitySearchBar() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (term.trim()) {
      navigate(`/products?q=${encodeURIComponent(term)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-wrapper">
      <div className="search-title">Search RR Nagar</div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search groceries, flowers, services, restaurants…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
}
