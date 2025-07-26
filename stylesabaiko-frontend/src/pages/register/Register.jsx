import React, { useState } from 'react';
import '../CSS/Authentication.css';
import { registerUserApi } from '../../apis/Api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    // State variables
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // State for errors
    const [fullNameError, setFullNameError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // State for OTP modal
    const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");

    // Handle input changes
    const handleFullName = (e) => setFullName(e.target.value);
    const handlePhone = (e) => setPhone(e.target.value);
    const handleEmail = (e) => setEmail(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);
    const handleOtp = (e) => setOtp(e.target.value);

    // Validation function
const validate = () => {
    let isValid = true;

    if (fullName.trim() === "") {
        setFullNameError("Fullname is Required");
        isValid = false;
    }
    if (phone.trim() === "") {
        setPhoneError("Phone is Required");
        isValid = false;
    }
    if (email.trim() === "") {
        setEmailError("Email is Required");
        isValid = false;
    }
    if (password.trim() === "") {
        setPasswordError("Password is Required");
        isValid = false;
    } else {
        // Password strength check
        const passwordStrength = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordStrength.test(password)) {
            setPasswordError("Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.");
            isValid = false;
        }
    }

    return isValid;
};


    // Submit form and trigger OTP modal
    const handleSubmit = (e) => {
        e.preventDefault();

        // Reset OTP error when submitting again
        setOtpError("");
        
        // Validation
        const isValid = validate();
        if (!isValid) return;

        const data = { fullName, phone, email, password };

        registerUserApi(data).then((res) => {
            if (res.data.success === false) {
                toast.error(res.data.message);
            } else {
                toast.success(res.data.message);
                // Show OTP modal after successful registration
                setIsOtpModalVisible(true);
            }
        });
    };

    // Handle OTP verification
    const handleOtpSubmit = () => {
        if (otp.trim() === "") {
            setOtpError("OTP is required");
            return;
        }

        if (otp === '123456') {
            toast.success("OTP verified successfully");
            setIsOtpModalVisible(false); // Hide modal on success
            navigate('/');
        } else {
            toast.error("The OTP is invalid.")
        }
    };

    return (
        <div className="loginsignup">
            <div className="loginsignup-container">
                <h1>Register</h1>
                <div className="loginsignup-fields">
                    <input
                        onChange={handleFullName}
                        type="text" placeholder="Full Name" />
                    {fullNameError && <p className="text-danger">{fullNameError}</p>}
                    
                    <input
                        onChange={handlePhone}
                        type="text" placeholder="Phone" />
                    {phoneError && <p className="text-danger">{phoneError}</p>}
                    
                    <input
                        onChange={handleEmail}
                        type="email" placeholder="Email Address" />
                    {emailError && <p className="text-danger">{emailError}</p>}
                    
                    <input
                        onChange={handlePassword}
                        type="password" placeholder="Password" />
                    {passwordError && <p className="text-danger">{passwordError}</p>}
                </div>
                <button onClick={handleSubmit}>Register</button>
                <p className="loginsignup-login">
                    Already have an account? <a href="/login"><span>Login here</span></a>
                </p>
            </div>

            {/* Bootstrap OTP Modal */}
            <div className={`modal fade ${isOtpModalVisible ? 'show' : ''}`} tabIndex="-1" style={{ display: isOtpModalVisible ? 'block' : 'none' }} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content shadow-lg rounded-3">
                        <div className="modal-header">
                            <h5 className="modal-title">Enter OTP</h5>
                            <button type="button" className="btn-close" onClick={() => setIsOtpModalVisible(false)} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={handleOtp}
                                className="form-control py-3"
                            />
                            {otpError && <p className="text-danger mt-2">{otpError}</p>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setIsOtpModalVisible(false)}>
                                Close
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleOtpSubmit}>
                                Verify OTP
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
