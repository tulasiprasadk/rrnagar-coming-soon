import React, { useState } from "react";
import "./Home.css";
import heroImg from "../assets/rrnagar_hero.jpg";
import CitySearchBar from "../components/CitySearchBar";

// Ads
import vchase from "../assets/ads/vchase.png";
import rrnagar from "../assets/ads/rrnagar.png";
import gephyr from "../assets/ads/gephyr.png";

export default function Home() {
  // Duplicate ads to create a seamless infinite scroll effect
  const ads = [
    { id: 1, src: vchase, alt: "VChase" },
    { id: 2, src: rrnagar, alt: "RR Nagar" },
    { id: 3, src: gephyr, alt: "Gephyr" },
    // Duplicates
    { id: 4, src: vchase, alt: "VChase" },
    { id: 5, src: rrnagar, alt: "RR Nagar" },
    { id: 6, src: gephyr, alt: "Gephyr" },
    { id: 7, src: vchase, alt: "VChase" },
    { id: 8, src: rrnagar, alt: "RR Nagar" },
    { id: 9, src: gephyr, alt: "Gephyr" }
  ];

  return (
    <main className="home-container">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-image">
          <img src={heroImg} alt="RR Nagar Landscape" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-text">
          <h1>ನಮ್ಮ ರಾಜರಾಜೇಶ್ವರಿ ನಗರ</h1>
          <p>The Royal Gateway to Bengaluru</p>
          <CitySearchBar />
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="popular-cat">
        <h2>Popular Categories</h2>
        <div className="cat-grid">
          <div className="cat-item">
            <span className="cat-icon">🥬</span>
            <span>Groceries</span>
          </div>
          <div className="cat-item">
            <span className="cat-icon">💐</span>
            <span>Flowers</span>
          </div>
          <div className="cat-item">
            <span className="cat-icon">🧨</span>
            <span>Crackers</span>
          </div>
          <div className="cat-item">
            <span className="cat-icon">🍽️</span>
            <span>Food</span>
          </div>
          <div className="cat-item">
            <span className="cat-icon">🔧</span>
            <span>Services</span>
          </div>
          <div className="cat-item">
            <span className="cat-icon">🚌</span>
            <span>Travels</span>
          </div>
        </div>
      </section>

      {/* ADS SECTION */}
      <section className="ads-section">
        <div className="ads-container">
          {ads.map((ad) => (
            <div key={ad.id} className="ad-card">
              <img src={ad.src} alt={ad.alt} className="ad-img" />
            </div>
          ))}
        </div>
      </section>

      {/* EXPLORE SECTION */}
      <section className="explore-section">
        <h2>Discover RR Nagar</h2>
        <div className="explore-grid">
          <ExploreItem
            icon="⛩️"
            title="Temples"
            desc="Spiritual & heritage sites."
            longInfo="Famous temples: Rajarajeshwari Temple, Bhuvaneshwari Temple, and more."
          />
          <ExploreItem
            icon="🌳"
            title="Parks"
            desc="Green spaces & lakes."
            longInfo="Halagevaderahalli Lake, Ideal Homes Park, and many gardens to relax."
          />
          <ExploreItem
            icon="🛍️"
            title="Shopping"
            desc="Malls & Markets."
            longInfo="Gopalan Arcade, BEML Complex, and vibrant local markets."
          />
          <ExploreItem
            icon="🍽️"
            title="Food"
            desc="Restaurants & Cafes."
            longInfo="From local darshinis to fine dining and cozy cafes."
          />
          <ExploreItem
            icon="🎓"
            title="Education"
            desc="Schools & Colleges."
            longInfo="Top institutions like RNSIT, JSS, and National Hill View Public School."
          />
        </div>
      </section>
    </main>
  );
}

function ExploreItem({ icon, title, desc, longInfo }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="explore-card"
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
    >
      <div className="explore-icon-wrap">
        <span className="explore-icon">{icon}</span>
      </div>

      <h3>{title}</h3>
      <p>{desc}</p>

      <div className={`explore-popup ${open ? "open" : ""}`}>
        <div className="popup-title">{title}</div>
        <div className="popup-body">{longInfo}</div>
      </div>
    </div>
  );
}
