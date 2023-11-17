import React from 'react';
import Header from './Header';
import Logo from '../../asset/logo2.png';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Header />
      <div className="main_content">
        <div className="content_text">
          <div className="main_text">
            Making Healthcare Better Together
          </div>
            <div className="logo_home">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="Sub_text">
            <p>
              Welcome to our healthcare haven, where we put your well-being
              first. Discover a world of personalized care, tailored to your
              unique needs. Our team of compassionate experts is dedicated to
              your health journey. Explore cutting-edge treatments and stay
              informed with our resources. Your health, our priority -
              experience excellence in healthcare. Trust us to guide you towards
              a healthier, happier life.
            </p>
          </div>
        
          <div className="buttons">
            <button className="appointment-button">Take an Appointment</button>
            <button className="about-us-button">About Us</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
