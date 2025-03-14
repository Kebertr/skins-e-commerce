import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoggInStyles.css";
import BackHeader from "./subElements/BackHeader";

//Gets session data
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

//The whole account page
function Account() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ p1: "" });
  const [data, setData] = useState([]);
  const [sessionData, setSessionData] = useState(null); // Store session info

  useEffect(() => {
    getSession((session) => {
      setSessionData(session);
    });
  }, []);

  useEffect(() => {
    if (sessionData) {
      fetchOrders();
    }
  }, [sessionData]); 

  const fetchOrders = () => {
    var userId = sessionData.userId;
    let hostname = `http://${window.location.hostname}:3000/getOrders?userId=${userId}`;

    axios.get(hostname)
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.log("Oops that should not happen");
      });
  };

  //Saves inputed data in usestate variables (by id)
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };


  //handels click when want to uppdate cash-coins

  var username = sessionData?.username;
  var cash = (sessionData?.cash ?? 0) + parseInt(formData.u || 0);

  const handleCashChange = (event) => {
    let hostname = "http://" + window.location.hostname + ":3000/cash";
    axios
      .post(hostname, { cash, username })
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        setSessionData((prev) => ({ ...prev, cash }));
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
    
    window.location.reload();
  };

  return (
    <>
      <BackHeader />

      <div className="bodyAccount">
        <div className="login-container">
          <h2>
            {
              sessionData?.username ||
                "Session data not found" /*|| Neccesary for page to load as data is fetches async*/
            }
          </h2>
          <div>
            <p>
              {
                "Cash-coins avalable: " +
                  (sessionData?.cash ??
                    "Cash data not available") /*as || also removes 0 */
              }
            </p>
            <input
              id="u"
              type="text"
              name="username"
              placeholder="Add cash-coin amount"
              onChange={handleChange}
              required
            />
            <button onClick={handleCashChange}>Add cash-coins</button>
          </div>
          <div>
            <button onClick={() => Admin(navigate, sessionData)}>Admin Panel</button>
          </div>
        </div>
        <h1 className="h1Orders">Orders</h1>
        <div className="product-grid-account">
          {data.map((skin, i) => (
            <div className="product-card">
              <h4>Name: {skin.skin_name}</h4>
              <h4>Price: {skin.price}</h4>
              <h4>Amount: {skin.quantity}</h4>
              <h4>TotalCost: {skin.totalcost}</h4>
            </div>
          ))}
      </div>
      </div>
      
    </>
  );
}
function Admin(navigate, sessionData){
  var userId = sessionData.userId;
  let hostname = `http://${window.location.hostname}:3000/getAdmin?id=${userId}`;
  
  axios
    .get(hostname)
    .then((response) => {
      if(response.data[0].adminRole == 1){
        navigate("/adminPage");
      }
    })
    .catch((error) => {
      console.error("Could not get session data", error);
      callback(null); // Pass null on error
    });
}


export default Account;
