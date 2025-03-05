
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BackHeader from "./subElements/BackHeader";

export default function Details() {
  const { id } = useParams();
  const [skin, setSkin] = useState(null);
  


  const fetchSkin = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/skins/${id}`);
      setSkin(response.data);
    } catch (error) {
      console.log("Oops that should not happen");
    } 
  };

  useEffect(() => {
    fetchSkin();
  }, [id]);

  if (!skin) {
    return <p>Skin not found :/</p>; // show message if no skin is found
  }

  return (
    <>
    <BackHeader />
    <div>
        <h2>{skin.skin_name}</h2> 
        <img src={skin.image_location} alt={skin.skin_name} />
        <p>Price: {skin.skin_value} Cash-Coins</p> 
        <button>Add to Basket</button>
    </div>
    </>
  );
}
