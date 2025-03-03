import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/Home.css";
import HomeHeader from "./subElements/HomeHeader";
import HomeHeaderLoggedIn from "./subElements/HomeHeaderLoggedIn";

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

function Home() {
  const [data, setData] = useState([]);
  const [sessionData, setSessionData] = useState(null); // Store session info

  useEffect(() => {
    fetchSkins();

    // Call getSession with a callback function
    getSession((session) => {
      setSessionData(session);
      console.log("Session Data:", session);
    });
  }, []);

  const fetchSkins = () => {
    axios.get("http://localhost:3000/skins")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log("Oops that should not happen");
      });
  };

  return (
    <div className="page">
      <div className="head">
        {sessionData ? <HomeHeaderLoggedIn /> : <HomeHeader />}
      </div>
      <div className="product-grid">
        {data.map((skin, i) => (
          <div key={skin.id || i} className="product-card">
            <img src={skin.image_location} alt={skin.name} />
            <h4>{skin.name}</h4>
            <p>{skin.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
