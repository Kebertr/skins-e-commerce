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
        <p>Change stock of a skin</p>
        <input
          id="stock2"
          type="number"
          name="stock2"
          placeholder="How many skins should be in stock?"
          required
         />    
        <input
          id="skin.id"
          type="number"
          name="skin.id"
          placeholder="Skins ID"
          required
        />

        <button
          onClick={() =>changeStock(document.getElementById("stock2").value, 
                                    document.getElementById("skin.id").value)}>Change stock</button>


      </div>
    </div>
  );
}

function addSkin(skin_name, category, skin_value, stock, image_location){
  if(stock<=0 || skin_value <=0){
    alert("Can't input negative values");
  }else{
    axios
      .post("http://localhost:3000/createSkin", {skin_name, category, skin_value, stock, image_location})
      
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        window.location.reload();
      })
  }
  
}
function changeStock(stock, id) {
  if (stock <= 0 || id <= 0) {
    alert("Can't input negative values");
  } else {
    axios
      .put("http://localhost:3000/changeSkinStockAdmin", { stock, id })
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
