import axios from 'axios';
import '../styles/LoggInStyles.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackHeader from './subElements/BackHeader';

//The whole logg in page
function Register() {
    const [formData, setFormData] = useState({p1: "", p2: ""})
    const [passwordText, setPasswordText] = useState("");
    const navigate = useNavigate();

    const handleChange = (event) => {
        setFormData({...formData, [event.target.id]: event.target.value});
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("handleSubmit")
        navigate("/");
    }

    useEffect(() => {
        if (formData.p1 === formData.p2 && formData.p1 !== "") {
            setPasswordText("✅ Matching");
        } else if (formData.p1 === "" && formData.p2 === "") {
            setPasswordText(""); // Clears message when both fields are empty
        } else {
            setPasswordText("🚨 Passwords not matching");
        }
    }, [formData]);

    return(
        <>
            <BackHeader/>

            <div className='body'>
                <div className="login-container">
                    <h2>Register</h2>
                    <form action="#" method="POST" onSubmit={handleSubmit}>
                        <input type="text" name="username" placeholder="Username" required />
                        <input id="p1" type="password" name="password" placeholder="Password" onChange={handleChange} required />
                        <input id="p2" type="password" name="password" placeholder="Reenter Password" onChange={handleChange} required />
                        <p>{passwordText}</p>
                        <button type="submit">Log In</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register;