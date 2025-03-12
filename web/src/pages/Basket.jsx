import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import BackHeader from "./subElements/BackHeader";
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
  const navigate = useNavigate();
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
    var userId = sessionData.userId;
    var url = `http://localhost:3000/basket?id=${userId}`
    
    axios.get(url)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log("Oops that should not happen");
      });
  };

  const handleCheckoutClick = (event) => {
    console.log("--> Checkout")
    navigate("/Checkout");
  }

  const handleAccountClick = (event) => {
    console.log("--> Account")
    navigate("/Account");
  }
  
  const handleBackClick = (event) => {
    console.log("--> back")
    navigate("/");
  }

  return (
    <div className="page">
      <div className="head">
        <header className="header">
        <h2 className="h2">Page Title Home</h2>
        <div className="buttonsBasket">
          <button className="header-button" onClick={handleBackClick}>Home</button>
          <button className="header-button" onClick={handleCheckoutClick}>Checkout</button>
          <button className="header-button" onClick={handleAccountClick}>Account</button>
        </div>
      </header>
        
      </div>
      <div className="product-grid">
        {data.map((skin, i) => (
          <div className="product-card">
            <h4>{skin.skin_name}</h4>
            <h4>{skin.skin_value}</h4>
            <h4>{skin.quantity}</h4>
            <h4>{skin.quantity * skin.skin_value}</h4>
            <button onClick={() => deleteCart(skin, navigate)}>Delete from Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function deleteCart(skin, navigate){
  axios
      .post("http://localhost:3000/deleteCart", {skin})
      
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        window.location.reload();
      })
}

export default Basket;
