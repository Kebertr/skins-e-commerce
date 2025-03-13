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
    let hostname = "http://" + window.location.hostname + ":3000/getOrders";

    axios
    .get(hostname)
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

  return (
    <div className="page">
      <div className="head">
        <BackHeader />
      </div>
      <div className="product-grid">
      <div className="product-card">
      <p>Add a skin</p>
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
        <div className="product-card">
        <p>Change stock of a skin</p>
        <input
          id="stock2"
          type="number"
          name="stock2"
          placeholder="How many skins should be in stock?"
          required
         />    
        <input
          id="skin.name"
          type="text"
          name="skin.name"
          placeholder="Skin name"
          required
        />

        <button
          onClick={() =>changeStock(document.getElementById("stock2").value, 
                                    document.getElementById("skin.name").value)}>Change stock</button>
        </div>
        
        <div className="product-card">
        <p>Change price of a skin</p>
        <input
          id="price"
          type="number"
          name="price"
          placeholder="What should the price be?"
          required
         />    
        <input
          id="skin_name_price"
          type="text"
          name="skin_price"
          placeholder="skin name"
          required
        />

        <button
          onClick={() =>changePrice(document.getElementById("price").value, 
                                    document.getElementById("skin_name_price").value)}>Change price</button>
        </div>

      </div>
    </div>
  );
}

function addSkin(skin_name, category, skin_value, stock, image_location){
  if(stock<=0 || skin_value <=0){
    alert("Can't input negative values");
  }else{
    let hostname = "http://" + window.location.hostname + ":3000/createSkin";

    axios
      .post(hostname, {skin_name, category, skin_value, stock, image_location})
      
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        window.location.reload();
      })
  }
  
}
function changeStock(stock, name) {
  if (stock <= 0 || name == "") {
    alert("Can't input negative values");
  } else {
    let hostname = "http://" + window.location.hostname + ":3000/changeSkinStockAdmin";

    axios
      .put(hostname, { stock, name })
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        window.location.reload(); // Reload page after changes are made
      })
      .catch((error) => {
        console.error("Error changing stock:", error);
        alert("Failed to change stock. Check the console for details.");
      });
  }
}

function changePrice(price, name) {
  if (price <= 0 || name == "") {
    alert("Can't input negative values");
  } else {
    let hostname = "http://" + window.location.hostname + ":3000/changeSkinPriceAdmin";

    axios
      .put(hostname, { price, name })
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        window.location.reload(); // Reload page after changes are made
      })
      .catch((error) => {
        console.error("Error changing stock:", error);
        alert("Failed to change stock. Check the console for details.");
      });
  }
}

export default AdminPanel;
