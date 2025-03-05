import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/Home.css";
import HomeHeader from "./subElements/HomeHeader";
import HomeHeaderBasket from "./subElements/HomeHeaderBasket";

function getSession(callback) {
  var sessionID = document.cookie
    .split("; ")
    .find(row => row.startsWith("sessionId="))
    ?.split("=")[1];

  if (!sessionID) {
    console.error("Session ID not found in cookies");
    callback(null); // Call the callback with null if no sessionID found
    return;
  }

  axios
    .get("http://localhost:3000/session", { params: { sessionID } })
    .then((response) => {
      callback(response.data[0]); // Pass session data to callback
    })
    .catch((error) => {
      console.error("Could not get session data", error);
      callback(null); // Pass null on error
    });
}

function Basket() {
  const [data, setData] = useState([]);
  const [sessionData, setSessionData] = useState(null); // Store session info

  useEffect(() => {
    getSession((session) => {
      setSessionData(session); // Set session data
      console.log("Session from API:", session); // Log session directly
    });
  }, []);

  useEffect(() => {
    if (sessionData) {
      fetchBasket();
    }
  }, [sessionData]); 

  const fetchBasket = () => {
    console.log(sessionData.userId);
    var userId = sessionData.userId;
    var url = `http://localhost:3000/basket?id=${userId}`
    
    axios.get(url)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Oops that should not happen");
      });
      
  };

  return (
    <div className="page">
      <div className="head">
        {sessionData ? <HomeHeaderBasket /> : <HomeHeader />}
      </div>
      <div className="product-grid">
        {data.map((skin, i) => (
          <div className="product-card">
            <h4>{skin.skin_name}</h4>
            <h4>{skin.skin_value}</h4>
            <h4>{skin.quantity}</h4>
            <h4>{skin.quantity * skin.skin_value}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Basket;
