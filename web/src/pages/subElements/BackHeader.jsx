import { useNavigate } from "react-router-dom";
import "../../styles/BackHeaderStyles.css";

const BackHeader = () => {
  const navigate = useNavigate();

  const handleBackClick = (event) => {
    console.log("--> back")
    setTimeout(() => {
      //Navigate to home page
      navigate("/");
    }, 500); // 0,5 seconds
  }

  return (
    <>
      <header className="header">
        <button className="header-button" onClick={handleBackClick}>Return</button>
        <h2 className="h2">King-skins</h2>
      </header>
    </>
  );
};

export default BackHeader;
