import React, { useState } from 'react';
import '../CSS/Authentication.css';
import { registerUserApi } from '../../apis/Api';
import { verifyOtpApi } from '../../apis/Api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    // State variables
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState("");

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
    const handlePassword = (e) => {
        const pwd = e.target.value;
        setPassword(pwd);
        setPasswordStrength(checkPasswordStrength(pwd));
    };
    const checkPasswordStrength = (pwd) => {
        if (!pwd) return "";
        let score = 0;
        Object.values(requirements).forEach(({ test }) => {
            if (test(pwd)) score++;
        });

        if (score <= 2) return "Weak";
        if (score === 3) return "Moderate";
        if (score === 4) return "Good";
        if (score === 5) return "Excellent";
        return "";
    };

    const requirements = {
        length: {
            test: (pwd) => pwd.length >= 8,
            label: "At least 8 characters"
        },
        uppercase: {
            test: (pwd) => /[A-Z]/.test(pwd),
            label: "One uppercase letter"
        },
        lowercase: {
            test: (pwd) => /[a-z]/.test(pwd),
            label: "One lowercase letter"
        },
        number: {
            test: (pwd) => /[0-9]/.test(pwd),
            label: "One number"
        },
        specialChar: {
            test: (pwd) => /[@$!%*?&]/.test(pwd),
            label: "One special character (@$!%*?&)"
        }
    };
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
        setOtpError(""); // Reset OTP error

        if (!validate()) return;

        // Only send email to get OTP
        registerUserApi({ fullName, phone, email, password })
            .then((res) => {
                if (res.data.success) {
                    toast.success("OTP sent to your email.");
                    setIsOtpModalVisible(true);  // Show modal after OTP is sent
                } else {
                    toast.error(res.data.message || "Failed to send OTP.");
                }
            })
            .catch(() => {
                toast.error("Failed to send OTP.");
            });
    };

    // 2. After OTP is correct, actually create the account
    const handleOtpSubmit = () => {
        if (otp.trim() === "") {
            setOtpError("OTP is required");
            return;
        }

        verifyOtpApi({ email, otp })
            .then((res) => {
                if (res.data.success) {
                    toast.success("OTP verified successfully");

                    // Now create user
                    const userData = { fullName, phone, email, password };
                    registerUserApi(userData)
                        .then((res) => {
                            if (res.data.success) {
                                toast.success("Registration successful!");
                                setIsOtpModalVisible(false);
                                navigate('/');
                            } else {
                                toast.error("Registration failed.");
                            }
                        })
                        .catch(() => toast.error("Error creating user"));
                } else {
                    toast.error("Invalid OTP.");
                }
            })
            .catch(() => {
                toast.error("OTP verification failed.");
            });
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
                        type="password"
                        placeholder="Password"
                        value={password}
                    />
                    {passwordError && <p className="text-danger">{passwordError}</p>}

                    {password.length > 0 && (
                        <>
                            <ul className="password-requirements" style={{ listStyleType: 'none', paddingLeft: 0 }}>
                                {Object.entries(requirements).map(([key, { test, label }]) => {
                                    const passed = test(password);
                                    return (
                                        <li key={key} style={{ color: passed ? 'lightgreen' : 'pink', marginBottom: 3 }}>
                                            {passed ? "✅" : "❌"} {label}
                                        </li>
                                    );
                                })}
                            </ul>

                            {passwordStrength && (
                                <p
                                    className={`password-strength ${passwordStrength.toLowerCase()}`}
                                    style={{
                                        color:
                                            passwordStrength === "Weak" ? "pink" :
                                                passwordStrength === "Moderate" ? "orange" :
                                                    passwordStrength === "Good" ? "lightblue" :
                                                        "lightgreen"
                                    }}
                                >
                                    Password strength: {passwordStrength}
                                </p>
                            )}
                        </>
                    )}

                </div>
                <button className='submit-btn' onClick={handleSubmit}>Register</button>
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
