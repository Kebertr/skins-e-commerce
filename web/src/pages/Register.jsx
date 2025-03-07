import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoggInStyles.css";
import BackHeader from "./subElements/BackHeader";

//The whole logg in page
function Register() {
  const [formData, setFormData] = useState({ p1: "", p2: "", u: "" });
  const [passwordText, setPasswordText] = useState("");
  const navigate = useNavigate();

  //Saves inputed data in usestate variables (by id)
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  //Used to ensure that variables has not uppdated async (variables are the ones inputed)
  useEffect(() => {
    if (formData.p1 === formData.p2 && formData.p1 !== "") {
      setPasswordText("✅ Matching");
    } else if (formData.p1 === "" && formData.p2 === "") {
      setPasswordText("");
    } else {
      setPasswordText("🚨 Passwords not matching");
    }
  }, [formData]);

  //handels submit form and returns message if username and password does not work
  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.p1 == formData.p2 && formData.u != "") {
      const newUser = {
        username: formData.u,
        user_password: formData.p1,
        adminRole: formData.admin
      };
    
    axios
      .post("http://localhost:3000/registerUser", newUser)
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        console.log(newUser);
        //Navigate to home page
        navigate("/");
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        setPasswordText("🚨 Username already exist")
      });
    } else { //Fields being empty is handeled automaticaly in form
        setPasswordText("🚨 Are u blind? Passwords must match! 🚨")
    }
  };

  return (
    <>
      <BackHeader />

      <div className="body">
        <div className="login-container">
          <h2>Register</h2>
          <form action="#" method="POST" onSubmit={handleSubmit}>
            <input
              id=""
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
            />
            <input
              id="p1"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <input
              id="p2"
              type="password"
              name="password"
              placeholder="Reenter Password"
              onChange={handleChange}
              required
            />
            <input
              id="admin"
              type="text"
              name="admin"
              placeholder="admin"
              onChange={handleChange}
              required
            />
            <p>{passwordText}</p>
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
