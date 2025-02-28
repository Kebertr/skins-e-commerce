import { useNavigate } from "react-router-dom";
import "../../styles/HomeHeaderStyles.css"
import { useState } from "react";

const HomeHeader = () => {
  const navigate = useNavigate();

  const handleRegisterClick = (event) => {
    console.log("--> register")
    navigate("/Register");
  }

  const handleLoggInClick = (event) => {
    console.log("--> logg in")
    navigate("/LoggIn");
  }

  return (
    <>
      <header className="header">
        <h2 className="h2">Page Title Home</h2>
        <div className="buttons">
          <button className="header-button" onClick={handleRegisterClick}>Register</button>
          <button className="header-button" onClick={handleLoggInClick}>Logg In</button>
        </div>
      </header>
    </>
  );
};

export default HomeHeader;
