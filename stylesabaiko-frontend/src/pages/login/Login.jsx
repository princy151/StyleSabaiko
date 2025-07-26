import React, { useState } from 'react'
import '../CSS/Authentication.css'
import { toast } from 'react-toastify';
import { loginUserApi } from '../../apis/Api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    // useState
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Form validation function
    const validate = () => {
        let isValid = true;
        if (email.trim() === "") {
            setEmailError("Email is empty or invalid");
            isValid = false;
        }

        if (password.trim() === "") {
            setPasswordError("Password is Required");
            isValid = false;
        }

        return isValid;
    };

    // Form submission handler
    const handleSubmit = (e) => {
        e.preventDefault();

        const isValid = validate();
        if (!isValid) {
            return;
        }
        //making json object

        const data = {
            email: email,
            password: password,
        };

        // Making API requests
        console.log("Login data:", data); // Log data being sent in the request
        loginUserApi(data)
            .then((res) => {
                console.log("Login response:", res.data); // Log the response data
                // Success: true/false, message
                if (res.data.success === false) {
                    toast.error(res.data.message);
                } else {
                    //1.set token
                    localStorage.setItem("token", res.data.token);

                    // 2.convert json object
                    const convertedData = JSON.stringify(res.data.userData);

                    //3.set userdata in local storage
                    localStorage.setItem("user", convertedData);
                    navigate('/')
                }
            })
            .catch((error) => {
                console.error("Login API error:", error);
                toast.error("An error occurred while logging in. Please try again.");
            });
    };
    return (
        <div className='loginsignup'>
            <div className="loginsignup-container">
                <h1>Sign Inn</h1>
                <div className="loginsignup-fields">
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email" placeholder='Email Address' />
                    {emailError && <p className="text-danger">{emailError}</p>}
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password" placeholder='Password' />
                    {passwordError && <p className="text-danger">{passwordError}</p>}
                </div>
                <button onClick={handleSubmit}>Continue</button>
                <p className="loginsignup-login">Don't have an account? <a href="/register"><span>Register here</span></a></p>
            </div>
        </div>
    )
}
export default Login
