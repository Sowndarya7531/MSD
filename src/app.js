import React, { useEffect } from 'react';
import Swiper from 'swiper';
import { loadFull } from 'tsparticles';
import './App.css';  // Make sure you import the CSS file here

function App() {
  useEffect(() => {
    // Initialize tsParticles
    const particlesInit = async (main) => {
      await loadFull(main);
    };

    // Initialize Swiper
    new Swiper('.swiper', {
      effect: 'cube',
      grabCursor: true,
      loop: true,
      speed: 1000,
      cubeEffect: {
        shadow: false,
        slideShadows: true,
        shadowOffset: 10,
        shadowScale: 0.94,
      },
      autoplay: {
        delay: 2600,
        pauseOnMouseEnter: true,
      },
    });
  }, []);

  return (
    <div id="root">
      <div id="tsparticles"></div>
      <section>
        <div className="content">
          <h1>Let's Travel The World Together!</h1>
          <p>
            Our tours are designed to transport you to the heart of the world's
            most captivating destinations, creating memories that will last a
            lifetime. You can uncover the hidden gems, iconic landmarks, and
            unique cultural treasures that make each destination special.
          </p>
          <button>Explore Tours</button>
        </div>

        <div className="swiper">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/49db1b5f-09f6-4433-be57-51687585600c" alt="Walking Tour in Florence" />
              <div className="cost">from $230 per group</div>
              <div className="overlay">
                <h1>Walking Tour in Florence</h1>
                <p>
                  Discover the fascinating beauty of this historic city by
                  strolling through the rich cultural tapestry that makes Florence
                  a timeless destination.
                </p>
                <div className="ratings">
                  <div className="stars">
                    <ion-icon className="star" name="star"></ion-icon>
                    <ion-icon className="star" name="star"></ion-icon>
                    <ion-icon className="star" name="star"></ion-icon>
                    <ion-icon className="star" name="star"></ion-icon>
                    <ion-icon className="star" name="star-half-outline"></ion-icon>
                  </div>
                  <span>138 reviews</span>
                </div>
              </div>
            </div>
            {/* Add more slides as needed */}
          </div>
        </div>
      </section>

      <a href="https://www.youtube.com/@ecemgokdogan/videos" target="_blank" className="logo">
        <img src="https://assets.codepen.io/9868786/youtube.webp" alt="HTML tutorial" />
      </a>
    </div>
  );
}

export default App;
