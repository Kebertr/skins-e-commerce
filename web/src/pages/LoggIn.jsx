import axios from 'axios';
import '../styles/LoggInStyles.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackHeader from './subElements/BackHeader';

//The whole logg in page
function LoggIn() {
    const [formData, setFormData] = useState({username: "", password: ""})
    const navigate = useNavigate();

    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value});
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        console.log(formData.username + " " + formData.password)
        navigate("/");
    }

    return(
        <>
            <BackHeader/>

            <div className='body'>
                <div className="login-container">
                    <h2>Login</h2>
                    <form action="#" method="POST" onSubmit={handleSubmit}>
                        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                        <button type="submit" >Log In</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default LoggIn;