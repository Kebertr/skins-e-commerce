import axios from "axios";
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

  const handleLogOutClick = (event) => {
    console.log("--> Log Out")
    deleteCookie(); 
    window.location.reload();
  }

  const deleteCookie = () => {
    const sessionID = (document.cookie
    .split("; ")
    .find(row => row.startsWith("sessionId="))
    ?.split("=")[1]);

    console.log(sessionID);
    //delete cookie from database
    axios
          .post("http://localhost:3000/deleteSession", {sessionID})
          .then((response) => {

            //Delete cookie from browser
            document.cookie.split(";").forEach((cookie) => {
              const [name] = cookie.split("=");
              document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`; //Deletes cookie by setting expire date to 1970
            });

            console.log("session deleted?");
          })
          .catch((error) => {
            console.error("could not get session id");
          });
  };

  return (
    <>
      <header className="header">
        <h2 className="h2">King-skins</h2>
        <div className="buttonsBasket">
          <button className="header-button" onClick={handleBasketClick}>Basket</button>
          <button className="header-button" onClick={handleAccountClick}>Account</button>
          <button className="header-button" onClick={handleLogOutClick}>Log Out</button>
        </div>
      </header>
    </>
  );
};

export default HomeHeader;
