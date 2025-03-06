import axios from "axios";
import { useEffect, useState } from "react";
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

function AdminPanel() {
  const [data, setData] = useState([]);
  const [sessionData, setSessionData] = useState(null); // Store session info

  useEffect(() => {
      getSession((session) => {
        setSessionData(session); // Set session data
        console.log("Session from API:", session); // Log session directly
      });
    }, []);


  const fetchOrders = () => {
    axios
    .get(`http://localhost:3000/getOrders`)
    .then((response) => {
      setData(response);
    })
    .catch((error) => {
      console.error("Could not get orders", error);
    });
      
  };
  
  useEffect(() => {
    fetchOrders();
    }, []); 

    console.log(data.data);

  return (
    <div className="page">
      <div className="head">
        <BackHeader />
      </div>
      <div className="product-grid">
        <input
            id="name"
            type="text"
            name="name"
            placeholder="name of skin"
            required
        />
        <input
            id="category"
            type="text"
            name="category"
            placeholder="Category"
            required
        />

        <input
            id="value"
            type="number"
            name="value"
            placeholder="value of the skin"
            required
        />

        <input
            id="stock"
            type="number"
            name="stock"
            placeholder="How many skins in stock?"
            required
          />    
        <input
            id="image"
            type="text"
            name="image"
            placeholder="Location of image"
            required
        />

        <button onClick={() => addSkin(document.getElementById("name").value,
                                        document.getElementById("category").value,
                                        document.getElementById("value").value,
                                        document.getElementById("stock").value,
                                        document.getElementById("image").value)}>Add skin</button>



      </div>
    </div>
  );
}

function addSkin(skin_name, category, skin_value, stock, image_location){
  axios
      .post("http://localhost:3000/createSkin", {skin_name, category, skin_value, stock, image_location})
      
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        window.location.reload();
      })
}

export default AdminPanel;
