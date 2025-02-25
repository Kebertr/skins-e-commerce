import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/Home.css";
import HomeHeader from "./subElements/HomeHeader";

function Home() {
  const [data, backdata] = useState([]);

  const fetchSkins = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/skins");
      backdata(response.data);
    } catch (error) {
      console.log("Oops that should not happen");
    }
  };

  useEffect(() => {
    fetchSkins();
  }, []);

  return (
    <div className="page">
      <div className="head">
        <HomeHeader />
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
