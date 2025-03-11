import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

function Checkout() {
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
  
  let totalValue = data.reduce((sum, skin) => sum + skin.skin_value * skin.quantity, 0);


  return (
    <div className="page">
      <div className="head">
        {sessionData ? <HomeHeaderBasket /> : <HomeHeader />}
      </div>
      <div className="product-grid">
            
          <div className="product-card">
            <h2>Cost for the products</h2>
            <h2>{totalValue}</h2>
          </div>
          <div className="product-card">
            <h2>You have</h2>
            <h2>{sessionData?.cash}</h2>
          </div>
          <button onClick={() => pay(totalValue, data, sessionData, navigate)}>Pay</button>
      </div>
    </div>
  );
}
function pay(totalValue, data, sessionData, navigate){
  var check = false;
  data.forEach(prop => {
    if(sessionData?.cash > totalValue && prop.quantity < prop.stock){
      console.log("Yay");
    }else{
      alert("Not enough money or not enough in stock");
      check = true;
      return;
  }
  
  });
  if(check == true){
    return;
  }
  var userId = sessionData.userId;
  var username = sessionData.username;
  var cash = sessionData.cash-totalValue;
  axios
      .post("http://localhost:3000/checkout", {userId, cash, username, data})
      
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        //Navigate to home page
        navigate("/");
      
        
      })
      
      
}

export default Checkout;
