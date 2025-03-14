import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackHeader from "./subElements/BackHeader";

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

function Details() {
  const { id } = useParams();
  const [skin, setSkin] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [sessionData, setSessionData] = useState(null); // Store session info

  useEffect(() => {
    getSession((session) => {
      setSessionData(session); // Set session data
      console.log("Session from API:", session); // Log session directly
    });
  }, []);

  useEffect(() => {
    if (sessionData) {
      fetchSkin();
    }
  }, [sessionData]);

  const fetchSkin = async () => {
    let hostname = `http://${window.location.hostname}:3000/skins/${id}`;

    try {
      const response = await axios.get(hostname);
      setSkin(response.data);
    } catch (error) {
      console.log("Oops that should not happen");
    }
  };

  useEffect(() => {
    fetchSkin();
  }, [id]);

  useEffect(() => {
    if (!skin) return; // Ensure `skin` is set before fetching reviews

    const fetchReviews = async () => {
      console.log("Fetching reviews for skin:", skin);

      try {
        let hostname = `http://${window.location.hostname}:3000/reviewProduct?productId=${skin.id}`;
        const response = await axios.get(
          hostname
        );
        setReviews(response.data);
      } catch (error) {
        console.log("Oops that should not happen");
      }
    };

    fetchReviews();
  }, [skin]); // Depend on `skin`, not an empty array

  if (!skin) {
    return <p>Skin not found :/</p>;
  }

  return (
    <>
      <BackHeader />
      <div>
        <img src={"/public/" + skin.image_location} alt={skin.skin_name} />
        <p>Price: {skin.skin_value} Cash-Coins</p>
        <input
          id="quantity"
          type="text"
          name="quantity"
          placeholder="quantity"
          required
        />
        <button
          onClick={() =>
            addBasket(
              skin,
              sessionData,
              document.getElementById("quantity").value
            )
          }
        >
          Add to your Basket
        </button>
        <input
          id="review"
          type="text"
          name="review"
          placeholder="review"
          required
        />
        <input
          id="grade"
          type="number"
          name="grade"
          placeholder="grade"
          required
        />
        <button
          onClick={() =>
            makeReview(
              skin,
              sessionData,
              document.getElementById("review").value,
              document.getElementById("grade").value
            )
          }
        >
          Grade
        </button>
      </div>
      <div>
        {reviews &&
          reviews.map((review, i) => (
            <div key={review.id || i} className="product-card">
              <p>{review.review}</p>
              <p>{review.grade}</p>
              <p>{review.username}</p>
            </div>
          ))}
      </div>
    </>
  );
}

function addBasket(skin, sessionData, quantity) {
  var productId = skin.id;
  var userId = sessionData.userId;

  let hostname = "http://" + window.location.hostname + ":3000/addSkin";

  axios
    .post(hostname, { quantity, userId, productId })

    .then((response) => {
      console.log("Data sent successfully:", response.data);
      window.location.reload();
    });
}

function makeReview(skin, sessionData, review, grade) {
  console.log(grade);
  if(grade > 0 && grade <= 5){
    var userId = sessionData.userId;
    var productId = skin.id;
    var productName = skin.skin_name;
  
    let hostname = "http://" + window.location.hostname + ":3000/makeReview";
  
    axios
      .post(hostname, {
        review,
        grade,
        userId,
        productId,
        productName,
      })
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        window.location.reload();
      })
      .catch((error) => {
        alert(error.response.data);
        return;
      });
  }else{
    alert("The grade needs to be between 1-5");
  }
 
}

export default Details;
