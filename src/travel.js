import React, { useState } from 'react';
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS
import './travel.css'; // Assuming travel.css is in the same folder
import L from 'leaflet'; // Assuming you want to use Leaflet for the map

// Navbar Component
const Navbar = () => (
  <header>
    <div className="navbar-fixed">
      <nav className="custom-navbar">
        <div className="container">
          <div className="nav-wrapper">
            <a href="./home.html" className="brand-logo">TravelVille</a>
            <a href="#" data-target="mobile-demo" className="sidenav-trigger">
              <i className="material-icons">menu</i>
            </a>
            <ul className="right hide-on-med-and-down">
              <li><a href="./home.html">Home</a></li>
              <li><a href="./travel.html">BookNow</a></li>
              <li><a href="#popular">About Us</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </header>
);

// TripDetails Component
const TripDetails = () => {
  const [tripType, setTripType] = useState('one-way');

  const handleTripTypeChange = (event) => {
    setTripType(event.target.value);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 transition duration-300 ease-in-out card-hover">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Trip Details</h2>

      {/* Trip Type Selection */}
      <div className="mb-8">
        <span className="block text-lg font-medium text-gray-700 mb-3">Trip Type</span>
        <div className="flex flex-wrap gap-6">
          {['one-way', 'round-trip', 'multi-city'].map((type) => (
            <label key={type} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value={type}
                className="form-radio text-purple-600 h-5 w-5"
                checked={tripType === type}
                onChange={handleTripTypeChange}
              />
              <span className="ml-3 text-lg">{type.replace('-', ' ').toUpperCase()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Trip Details Container */}
      <div id="trip-details" className="space-y-8">
        {/* Source Location */}
        <div>
          <label htmlFor="source" className="block text-lg font-medium text-gray-700 mb-2">Source Location</label>
          <input
            type="text"
            id="source"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            placeholder="Enter starting point"
          />
        </div>

        {/* Destination Locations */}
        <div id="destinations-container">
          <label className="block text-lg font-medium text-gray-700 mb-2">Destination</label>
          <div id="destination-fields" className="space-y-6">
            <div className="destination-segment relative">
              <input
                type="text"
                className="destination-input w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                placeholder="Enter destination"
              />
              <div className="mt-4">
                <label className="block text-lg font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  className="destination-date w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Travel Mode Selection */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">Travel Mode</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {['car', 'plane', 'bus', 'train'].map((mode) => (
              <label key={mode} className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition duration-200">
                <input type="radio" name="travelMode" value={mode} className="sr-only" />
                <i className={`fas fa-${mode} travel-mode-icon mb-3 text-4xl text-purple-600`}></i>
                <span className="text-lg font-medium">{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Find Route Button */}
      <button
        className="w-full mt-10 gradient-bg text-white py-4 px-6 rounded-xl hover:opacity-90 transition duration-200 flex items-center justify-center text-xl font-bold"
      >
        <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
        </svg>
        Find Route
      </button>
    </div>
  );
};

// Map Component
const MapComponent = () => {
  const mapRef = React.useRef(null);

  React.useEffect(() => {
    const map = L.map(mapRef.current).setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  }, []);

  return <div id="map" className="w-full rounded-xl" ref={mapRef}></div>;
};

// Travel Page Component
const TravelPage = () => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <header className="text-center mb-12">
      <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">Let's Start the Journey</h1>
      <p className="text-2xl text-gray-600">Discover the best route and travel options for your adventure</p>
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <TripDetails />
      <MapComponent />
    </div>
  </div>
);

export default TravelPage;
