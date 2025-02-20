import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [data, backdata] = useState([]);

  const fetchSkins = async () =>{
    try{
      const response = await axios.get('http://localhost:9000/api/skins');
      backdata(response.data);
      
    }
    catch(error){
      console.log('Oops that should not happen');
    }
      
  };

  useEffect(() =>{
    fetchSkins();
  }, []);

    return(

      data.map((skin, i) => (
        <div className='product-card'> 
          <img src={skin.image_location}/>
          <h4 key = '{skin.name+i}'>{skin.name}</h4>
          <p key = '{skin.value + i}'>{skin.value}</p>
        </div>
      ))
    )
}

export default App;

