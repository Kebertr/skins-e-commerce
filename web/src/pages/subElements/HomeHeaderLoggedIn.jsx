import { useNavigate } from "react-router-dom";
import "../../styles/HomeHeaderStyles.css";

const HomeHeader = () => {
  const navigate = useNavigate();

  const handleBasketClick = (event) => {
    console.log("--> Basket")
    navigate("/Basket");
  }

  const handleAccountClick = (event) => {
    console.log("--> Account")
    navigate("/Account");
  }

  return (
    <>
      <header className="header">
        <h2 className="h2">Page Title Home</h2>
        <div className="buttons">
          <button className="header-button" onClick={handleBasketClick}>Basket</button>
          <button className="header-button" onClick={handleAccountClick}>Account</button>
        </div>
      </header>
    </>
  );
};

export default HomeHeader;
