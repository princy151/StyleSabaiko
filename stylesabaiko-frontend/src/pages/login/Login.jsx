import React, { useState } from 'react'
import '../CSS/Authentication.css'
import { toast } from 'react-toastify';
import { loginUserApi } from '../../apis/Api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // Password visibility states
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Modal States
    const [showModal, setShowModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;

        const data = { email, password };

        loginUserApi(data)
            .then((res) => {
                if (res.data.success === false) {
                    toast.error(res.data.message);
                } else {
                    localStorage.setItem("token", res.data.token);
                    localStorage.setItem("user", JSON.stringify(res.data.userData));
                    navigate('/')
                }
            })
            .catch((error) => {
                console.error("Login error:", error);
                toast.error(error?.response?.data?.message || "Unexpected error");
            });
    };

    const handleForgotPassword = async () => {
        setShowModal(true);
        setStep(1);
        setForgotEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleSendOtp = async () => {
        if (!forgotEmail) return toast.error("Please enter your email");
        try {
            const response = await fetch("http://localhost:5000/api/user/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotEmail })
            });
            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
                setStep(2);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Error sending OTP");
        }
    };

    const handleResetPassword = async () => {
        if (!otp || !newPassword || !confirmPassword) {
            return toast.error("Enter OTP, new password and confirm password");
        }
        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match");
        }
        try {
            const response = await fetch("http://localhost:5000/api/user/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotEmail, otp, newPassword })
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Password reset successful");
                setShowModal(false);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Error resetting password");
        }
    };

    return (
        <div className='loginsignup'>
            <div className="loginsignup-container">
                <h1>Sign In</h1>
                <div className="loginsignup-fields">
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email" placeholder='Email Address' />
                    {emailError && <p className="text-danger">{emailError}</p>}

                    <div style={{ position: "relative" }}>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? "text" : "password"}
                            placeholder='Password'
                            style={{ paddingRight: "40px" }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                left: 190,
                                fontSize: "16px",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                color: "grey",
                                cursor: "pointer",
                                fontWeight: "bold"
                            }}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    {passwordError && <p className="text-danger">{passwordError}</p>}
                    <p style={{ textAlign: 'right', marginTop: '5px' }}>
                        <span
                            style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                            onClick={handleForgotPassword}
                        >
                            Forgot Password?
                        </span>
                    </p>
                </div>
                <button onClick={handleSubmit}>Continue</button>
                <p className="loginsignup-login">Don't have an account? <a href="/register"><span>Register here</span></a></p>
            </div>

            {/* GLASSMORPHIC MODAL */}
            {showModal && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0,
                    width: "100%", height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(8px)",
                    background: "rgba(0,0,0,0.4)",
                    zIndex: 1000,
                }}>
                    <div style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(15px)",
                        padding: "30px",
                        borderRadius: "16px",
                        color: "#fff",
                        width: "90%",
                        maxWidth: "400px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                        position: "relative"
                    }}>
                        <button
                            onClick={() => setShowModal(false)}
                            style={{
                                position: "absolute", top: 10, right: 15,
                                background: "transparent", border: "none",
                                color: "white", fontSize: "20px", cursor: "pointer"
                            }}
                        >×</button>

                        {step === 1 && (
                            <>
                                <h3 style={{ marginBottom: '15px' }}>Forgot Password</h3>
                                <input
                                    type="email"
                                    placeholder="Enter your registered email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "8px", border: "none" }}
                                />
                                <button
                                    onClick={handleSendOtp}
                                    style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#00aaff", border: "none", color: "white" }}
                                >
                                    Send OTP
                                </button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <h3 style={{ marginBottom: '15px' }}>Reset Password</h3>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "8px", border: "none" }}
                                />
                                <div style={{ position: "relative" }}>
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "8px", border: "none", paddingRight: "40px" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        style={{
                                            position: "absolute",
                                            right: 10,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            background: "none",
                                            border: "none",
                                            color: "grey",
                                            cursor: "pointer",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {showNewPassword ? "Hide" : "Show"}
                                    </button>
                                </div>

                                <div style={{ position: "relative" }}>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "8px", border: "none", paddingRight: "40px" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{
                                            position: "absolute",
                                            right: 10,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            background: "none",
                                            border: "none",
                                            color: "grey",
                                            cursor: "pointer",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {showConfirmPassword ? "Hide" : "Show"}
                                    </button>
                                </div>

                                <button
                                    onClick={handleResetPassword}
                                    style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#00cc66", border: "none", color: "white" }}
                                >
                                    Reset Password
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
