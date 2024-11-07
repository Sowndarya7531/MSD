import React, { useEffect } from "react";
import M from "materialize-css";
import "./home_style.css"; // Make sure to put your home_style.css in the same folder

const Home = () => {
  useEffect(() => {
    // Initialize Materialize components after the component mounts
    M.Slider.init(document.querySelectorAll('.slider'), {
      indicators: true,
      height: 500,
      transition: 600,
      interval: 3000,
    });

    M.Sidenav.init(document.querySelectorAll('.sidenav'));
  }, []);

  return (
    <div>
      {/* Navigation Bar */}
      <div className="navbar-fixed">
        <nav className="teal">
          <div className="container">
            <div className="nav-wrapper">
              <a href="home.html" className="brand-logo">TravelVille</a>
              <a href="#" data-target="mobile-demo" className="sidenav-trigger">
                <i className="material-icons">menu</i>
              </a>
              <ul className="right hide-on-med-and-down">
                <li><a href="home.html">Home</a></li>
                <li><a href="./travel.html">Search</a></li>
                <li><a href="popular.html">Popular Places</a></li>
                <li><a href="gallery.html">Gallery</a></li>
                <li><a href="contact.html">Contact</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <ul className="sidenav" id="mobile-demo">
        <li><a href="index.html">Home</a></li>
        <li><a href="search.html">Search</a></li>
        <li><a href="popular.html">Popular Places</a></li>
        <li><a href="gallery.html">Gallery</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>

      {/* Section: Slider */}
      <section id="home" className="slider">
        <ul className="slides">
          <li>
            <img src="https://wallpapers.com/images/high/rocky-beach-night-view-mw0hwnvj7001e43r.webp" alt="slider-img"/>
            <div className="caption center-align">
              <h2>Unleash Your Wanderlust</h2>
              <h5 className="light grey-text text-lighten-3 hide-on-small-only">
                Book your dream vacation with TravelVille! Experience unique destinations, personalized itineraries, and exclusive deals tailored just for you.
              </h5>
              <a href="search.html" className="btn btn-large">Book Now</a>
            </div>
          </li>
          <li>
            <img src="https://www.treksandtrails.org/system/images/000/708/950/25b99b1300b381369667e7668e2858fe/x600gt/camping_4.jpeg?1720630267" alt="slider-img"/>
            <div className="caption center-align">
              <h2>Adventure Awaits You</h2>
              <h5 className="light grey-text text-lighten-3 hide-on-small-only">
                Embark on thrilling escapades with our expertly curated travel packages. From scenic hikes to cultural explorations, your adventure begins here!
              </h5>
              <a href="search.html" className="btn btn-large">Join the Adventure</a>
            </div>
          </li>
          <li>
            <img src="https://things2.do/blogs/wp-content/uploads/2024/09/young-couple-having-romantic-evening-with-candles-on-beach.jpg" alt="slider-img"/>
            <div className="caption center-align">
              <h2>Romantic Getaways</h2>
              <h5 className="light grey-text text-lighten-3 hide-on-small-only">
                Create unforgettable moments in stunning romantic destinations with TravelVille. Let love lead the way to your perfect escape!
              </h5>
              <a href="search.html" className="btn btn-large">Plan Your Escape</a>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Home;
