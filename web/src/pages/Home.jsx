import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import HomeHeader from "./subElements/HomeHeader";
import HomeHeaderLoggedIn from "./subElements/HomeHeaderLoggedIn";
import SearchBar from "./subElements/searchBar"; // Import the SearchBar component

function getSession(callback) {
  var sessionID = document.cookie
    .split("; ")
    .find((row) => row.startsWith("sessionId="))
    ?.split("=")[1];

  if (!sessionID) {
    console.error("Session ID not found in cookies");
    callback(null); // Call the callback with null if no sessionID found
    return;
  }

  let hostname = "http://" + window.location.hostname + ":3000/session";

  axios
    .get(hostname, { params: { sessionID } })
    .then((response) => {
      callback(response.data[0]); // Pass session data to callback
    })
    .catch((error) => {
      console.error("Could not get session data", error);
      callback(null); // Pass null on error
    });
}

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]); // All skins from the API
  const [filteredData, setFilteredData] = useState([]); // Filtered skins based on search
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

    let hostname = "http://" + window.location.hostname + ":3000/skins";

    axios
      .get(hostname)
      .then((response) => {
        setData(response.data); // Set all skins
        setFilteredData(response.data); // Initialize filteredData with all skins
      })
      .catch((error) => {
        console.log("Oops that should not happen");
      });
  };

  const handleProductClick = (id) => {
    console.log("--> Go to product");
    navigate(`/Details/${id}`);
  };

  // Handle search text change
  const handleFilterTextChange = (text) => {
    if (text === "") {
      // If text is empty, show all skins
      setFilteredData(data);
    } else {
      // else show skins that user searched for, both name and category is searcheble 
      const filteredSkins = data.filter((skin) =>
        skin.skin_name.toLowerCase().includes(text.toLowerCase()) ||
        skin.category.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filteredSkins);
    }
  };
  
  return (
    <div className="page">
      <div className="head">
        {sessionData ? <HomeHeaderLoggedIn /> : <HomeHeader />}
        <SearchBar onFilterTextChange={handleFilterTextChange} /> {/* Add SearchBar */}
      </div>
      <div className="product-grid">
        {filteredData.map((skin, i) => (
          <div key={skin.id || i} className="product-card">
            <img src={skin.image_location} alt={skin.name} />
            <button onClick={() => handleProductClick(skin.id)}>
              {skin.skin_name}
            </button>
            <p>{skin.skin_value} Cash-Coins</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;