import { useNavigate } from "react-router-dom";
import "../../styles/BackHeaderStyles.css"

const BackHeader = () => {
  const navigate = useNavigate();

  const handleBackClick = (event) => {
    console.log("--> back")
    navigate("/");
  }

  return (
    <>
      <header className="header">
        <button className="header-button" onClick={handleBackClick}>Return</button>
        <h2>Page Title</h2>
      </header>
    </>
  );
};

export default BackHeader;
